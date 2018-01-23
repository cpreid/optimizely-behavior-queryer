var behavior = (function() {
  var b_api = optimizely.get('behavior');

  var fieldGroups = {
    general: ['type', 'name', 'category'],
    numeric: ['time', 'age', 'revenue']
  }
  var comparatorGroups = {
    numeric: ["gt", "gte", "lt", "lte", "between"],
    general: ["eq", "is", "in", "contains", "exists"]
  }

  var getComparators = function(field) {
    if (fieldGroups.numeric.indexOf(field) > -1) {
      return comparatorGroups.general.concat(comparatorGroups.numeric);
    }
    return comparatorGroups.general;
  }

  var isTag = function(field) {
    return fieldGroups.general.indexOf(field) < 0 && fieldGroups.numeric.indexOf(field) < 0;
  }

  var Queryer = function() {
    var q = {"version": "0.2"},
        resultsCallbacks = [];
    this.has_computational_aggregator = function() {
      return typeof q.reduce !== 'undefined' && q.reduce.aggregator !== 'undefined' && q.reduce.aggregator !== 'nth';
    }
    this.set_q_part = function(key, val) {
      q[key] = val;
    }
    this.delete_q_part = function(key) {
      delete q[key];
    }
    this.addFilter = function(filter) {
      if (!('filter' in q)) q['filter'] = [];
      q['filter'].push(filter);
      return this;
    }    
    this.addSort = function(sortrule) {
      if(this.has_computational_aggregator()) throw 'Cannot use sort with `compute`';
      if (!('sort' in q)) q['sort'] = [];
      q['sort'].push(sortrule);
      return this;
    }
    // this breaks when using in conjunction with a sort rule
    this.addComputationalAggregator = function(aggregate_fnc, aggregate_field) {
      if(!(aggregate_fnc && aggregate_field)) throw 'aggregate_fnc && aggregate_field must be used in compute';
      
      this.setAggregator(aggregate_fnc);
      this.pick(aggregate_field);      
    }
    this.addCallback = function(fcn) {
      resultsCallbacks.push(fcn);
      return this;
    }
    this.run = function(log_query) { 
      if(!this.has_computational_aggregator() && !('sort' in q)) {
        this.orderBy('time', 'descending');
      }          
      log_query && console.log(q);
      // apply any callbacks to result set
      var results = b_api.query(q);
      if(resultsCallbacks) {
        resultsCallbacks.forEach(function(fcn) {
          results = fcn.call(null, results);
        });
      }
      return results;
    }
  }

  Queryer.prototype = {
    uniques: function(field) {
      if(this.has_computational_aggregator()) throw 'Cannot fetch uniques when using computational'
      if(!field) throw 'Field is a required argument for `uniques` method'
      this.addCallback(function(results) {
        var pieces            = field.split(/\./),
            uniqueFieldValues = [],
            results           = results || [];
        // filter all results items, ensuring unique results items based on provided `field`
        return results.filter(function(item) {
          try {
            if(pieces.length > 1) var possibleUniqueValue = item[pieces[0]][pieces[1]];
            else var possibleUniqueValue = item[pieces[0]];
          } catch(err) {
            throw 'Unable to get `' + field + '` within results item (' + typeof(item) + ').';
          }          
          if(uniqueFieldValues.indexOf(possibleUniqueValue) < 0) {
            uniqueFieldValues.push(possibleUniqueValue);
            return true;
          }
          else return false;
        });  
      });    
      return this;  
    },
    setAggregator: function(fnc, params) {
      var reducer = {
        'aggregator': fnc
      }
      for (var p in (params || {})) {
        reducer[p] = params[p];
      }
      this.set_q_part('reduce', reducer);
      return this;
    },
    pick: function(field) {
      if (isTag(field)) {
        field = ['tags', field];
      } else {
        field = [field];
      }
      this.set_q_part('pick', {
        'field': field
      });
      return this;
    },
    where: function(field, comparator, val) {
      // validate comparator
      var availablecomparators = getComparators(field);
      comparator = comparator || 'exists';
      if(availablecomparators.indexOf(comparator) < 0) throw 'comparator (' + comparator + ') not valid for field: ' + field;
      if(comparator !== 'exists' && typeof val === 'undefined') throw 'you need a value when using comparator: ' + comparator;

      // identify if the field is a tag
      if (isTag(field)) {
        field = ['tags', field];
      } else {
        field = [field];
      }      
      var filter = {
        "field": field,
        "comparator": comparator        
      }
      if(comparator !== 'exists') filter.value = val;
      this.addFilter(filter);
      return this;
    },
    type: function(types) {
      var filter = {
        "field": ["type"],
        "value": types
      };
      if (types instanceof Array) {
        filter['comparator'] = 'in';
      }
      this.addFilter(filter);
      return this;
    },
    orderBy: function(field, direction) {
      this.addSort({
        "field": [field || "time"],
        "direction": direction || "descending"
      });
      return this;
    }
  }

  return {
    compute: function(aggregate_fnc, aggregate_field) {
      var queryer = new Queryer();
      queryer.addComputationalAggregator(aggregate_fnc, aggregate_field);
      return queryer;
    },    
    find: function(types) {
      var queryer = new Queryer();
      // add type filter on instantiation
      if (types) queryer.type(types);
      return queryer;
    },
    findOne: function(types) {
      var queryer = this.find(types);
      // add nth aggregator with n 0
      queryer.setAggregator('nth', {
        'n': 0
      });
      return queryer;
    },
    hasConvertedOn: function(event_namespace) {
      try {
        var type = event_namespace.split('.')[0],
            name = event_namespace.split('.')[1];
        return !!this.findOne(type).where('name', 'is', name).run();
      } catch(e) {        
        return false;
      }       
    }
  }
})();
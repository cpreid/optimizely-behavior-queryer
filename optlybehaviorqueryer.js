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
    var q = {
      "version": "0.2"
    };
    this.set_q_part = function(key, val) {
      q[key] = val;
    }
    this.addFilter = function(filter) {
      if (!('filter' in q)) q['filter'] = [];
      q['filter'].push(filter);
      return this;
    }
    this.addSort = function(sortrule) {
      if (!('sort' in q)) q['sort'] = [];
      q['sort'].push(sortrule);
      return this;
    }
    this.run = function(aggregate_fnc, aggregate_field, log_query) {
      if (aggregate_fnc && aggregate_field) {
        this.setAggregator(aggregate_fnc);
        this.pick(aggregate_field);
        // this breaks when using in conjunction with a sort rule
        delete q.sort;
      }
      else if(!('sort' in q)) { // default sort is time descending, unless overridden
        this.orderBy('time', 'descending');
      }
      log_query && console.log(q);
      return b_api.query(q);
    }
  }

  Queryer.prototype = {
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
      if (availablecomparators.indexOf(comparator) < 0) throw 'comparator (' + comparator + ') not valid for field: ' + field;

      // identify if the field is a tag
      if (isTag(field)) {
        field = ['tags', field];
      } else {
        field = [field];
      }
      this.addFilter({
        "field": field,
        "comparator": comparator,
        "value": val
      });
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
    }
  }
})();
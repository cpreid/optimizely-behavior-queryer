# Optimizely Behavior Queryer
> A wrapper for the Optimizely behavioral API that allows you to query using expressive methods instead of JSON

E.g. - query for `click` events that happened in the last three hours
```
behavior
  .find('click')
  .where('time', 'gte', new Date() - (3600 * 3 * 1000))
  .run();
```

---

> The following three methods return an instance of Queryer

```behavior.find()```
```behavior.findOne()```
```behavior.compute()```

### find
```
.find({string|Array} event_type)
```
 Returns a ```Queryer``` instance

| parameter | type   | details                                            | required | default |
|-----------|--------|----------------------------------------------------|----------|---------|
| event_type       | string | Event type to query for. Must be one of the following (click, pageview, custom) | no      |     all events    |
| event_type      | Array  | An array of event types to query for. Must be one of the following (click, pageview, custom)                      | no      |    all events    |

### findOne
```
.findOne([{string|Array} event_type])
```
 Returns a ```Queryer``` instance

| parameter | type   | details                                            | required | default |
|-----------|--------|----------------------------------------------------|----------|---------|
| event_type       | string | Event type to query for. Must be one of the following (click, pageview, custom) | no      |     all events    |
| event_type      | Array  | An array of event types to query for. Must be one of the following (click, pageview, custom)                      | no      |    all events    |

### compute
```
.compute({string} aggregator_fnc, {string} aggregator_field)
```
Returns a ```Queryer``` instance

| parameter | type   | details                                            | required | default |
|-----------|--------|----------------------------------------------------|----------|---------|
| aggregator_fnc       | string | Function name to apply to result values. Can be one of the following ["nth", "count", "sum", "avg", "max", "min"]. Using an aggregator will implictly apply a pick rule to the specified  ```aggregator_field``` | no      |     -    |
| aggregator_field      | string  | Field name to apply the function to. Using an aggregator will implictly apply a pick rule to the specified  ```aggregator_field```   | no      |    -    |

### hasConvertedOn
```
.hasConvertedOn({string} event_namespace)
```
Returns a ```boolean```

| parameter | type   | details                                            | required | default |
|-----------|--------|----------------------------------------------------|----------|---------|
| event_namespace       | string | Will check to see if a user converted on an event. The argument format should be as follows "event_type.event_name", e.g. ```hasConvertedOn('pageview.home')``` | yes      |     -    |

---


> The following methods belong to the Queryer instance, and are chainable

### Queryer.where
```
Queryer.where({string} event_field, {string} comparator, {string|number|Array} compare_to_value)
```
Adds a filter rule to the query, returns a ```Queryer``` instance

| parameter | type   | details                                            | required | default |
|-----------|--------|----------------------------------------------------|----------|---------|
| event_field       | string | Event field that you would like to query against. This can be a ```standard``` field found on all Optimizely events, including: ['type', 'name', 'category', 'time', 'age', 'revenue']. This can be a ```tag``` field that was attributed to the event as a tag. | yes      |    -    |
| comparator      | string  | Comparator expression to compare the event_field to the ```compare_to_value``` parameter                     | no      |    -    |
| compare_to_value      | string  | A value to compare the field against. Strings can be compared using the following comparators ["eq", "is", "in", "contains", "exists"]                     | yes, unless using 'exists' comparator     |    -    |
| compare_to_value      | number  | A value to compare the field against. Numbers can also use the following comparators ["gt", "gte", "lt", "lte", "between"]                     | yes, unless using 'exists' comparator     |    -    |
| compare_to_value      | Array  | An array of values to compare to                      | yes, unless using 'exists' comparator     |    -    |

### Queryer.orderBy
```
Queryer.orderBy({string} field, [{string} direction])
```
Will order the results, returns a ```Queryer``` instance

| parameter | type   | details                                            | required | default |
|-----------|--------|----------------------------------------------------|----------|---------|
| field       | string | Field to order by | yes      |     time    |
| direction      | string  | Direction to order the result Array. Must be [ascending or descending]    | no      |    descending    |

### Queryer.run
```
Queryer.run([{bool} log_query])
```
**```run()``` must be called at the end of each expression chain**
* Returns an event Object when used with ```findOne()``` or an Array of events when used with ```find()```
* Returns a numberic, computed value if ```compute()``` was used

| parameter | type   | details                                            | required | default |
|-----------|--------|----------------------------------------------------|----------|---------|
| log_query      | bool  | Will console.log the query object    | false      |    -    |

> Based on http://usejsdoc.org/tags-type.html & http://usejsdoc.org/tags-param.html

## Usage

> This will average all of the timestamps across ```click``` events
```
behavior
  .compute('avg', 'time')
  .where('type', 'is', 'click')
  .run();
```
> This will find all click events where page_visibility tag exists
```
behavior
  .find('click')
  .where('page_visibility', 'exists')
  .run()
```

> This will return the computed sum of all timestamps where the page_visibility tag is 'exists'
```
behavior
  .compute('sum', 'time')
  .where('page_visibility', 'exists')
  .run();
```

> Find all events where category is other
```
behavior
  .find()
  .where('category', 'is', 'other')
  .run();
```

> Find all events where category tag exists (omitted comparator implies 'exists')

```
behavior
  .find()
  .where('category')
  .run();
```

```
behavior
  .find()
  .where('time', 'lte', 1497662329070)
  .where('category', 'is', 'home')
  .orderBy('time', 'descending')
  .run();
```

```
behavior
  .find('pageview')
  .where('time', 'lte', 1497662329070)
  .where('category', 'is', 'home')
  .orderBy('time', 'descending')
  .run();
```

```
behavior
  .find()
  .where('time', 'lte', 1497662329070)
  .where('category', 'is', 'home')
  .where('page_visibility', 'is', 'hidden')
  .orderBy('time', 'descending')
  .run();
```

```
behavior
  .findOne()
  .where('page_visibility', 'exists')
  .pick('time')
  .orderBy('time', 'ascending')
  .run()
```

> This will return a list of epoch timestamps across all events from oldest to newest
```
behavior
  .find()
  .orderBy('time', 'ascending')
  .pick('time')
  .run();
```

> These will return a ```boolean``` given an event type & name
```
behavior
  .hasConvertedOn('pageview.home');

behavior
  .hasConvertedOn('custom.custom_event_name');  
```

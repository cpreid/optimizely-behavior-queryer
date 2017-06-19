# Optimizely Behavior Queryer
> A wrapper for the Optimizely behavioral API that allows you to query using expressive methods instead of JSON Edit
Add topics

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
.findOne({string|Array} event_type)
```
 Returns a ```Queryer``` instance

| parameter | type   | details                                            | required | default |
|-----------|--------|----------------------------------------------------|----------|---------|
| event_type       | string | Event type to query for. Must be one of the following (click, pageview, custom) | no      |     all events    |
| event_type      | Array  | An array of event types to query for. Must be one of the following (click, pageview, custom)                      | no      |    all events    |

### where
```
.where({string} event_field, {string} comparator, {string|number|Array} compare_to_value)
```
Adds a filter rule to the query, returns a ```Queryer``` instance

| parameter | type   | details                                            | required | default |
|-----------|--------|----------------------------------------------------|----------|---------|
| event_field       | string | Event field that you would like to query against. This can be a ```standard``` field found on all Optimizely events, including: ['type', 'name', 'category', 'time', 'age', 'revenue']. This can be a ```tag``` field that was attributed to the event as a tag. | yes      |    -    |
| comparator      | string  | Comparator expression to compare the event_field to the ```compare_to_value``` parameter                     | no      |    -    |
| compare_to_value      | string  | A value to compare the field against. Strings can be compared using the following comparators ["eq", "is", "in", "contains", "exists"]                     | yes, unless using 'exists' comparator     |    -    |
| compare_to_value      | number  | A value to compare the field against. Numbers can also use the following comparators ["gt", "gte", "lt", "lte", "between"]                     | yes, unless using 'exists' comparator     |    -    |
| compare_to_value      | Array  | An array of values to compare to                      | yes, unless using 'exists' comparator     |    -    |

### orderBy
```
.orderBy({string} field, [{string} direction])
```
Will order the results, returns a ```Queryer``` instance

| parameter | type   | details                                            | required | default |
|-----------|--------|----------------------------------------------------|----------|---------|
| field       | string | Field to order by | yes      |     time    |
| direction      | string  | Direction to order the result Array. Must be [ascending or descending]    | no      |    descending    |

### run
```
.run([{string} aggregator_fnc], [{string} aggregator_field], [{bool} log_query])
```
* Returns an event Object when used with ```findOne()``` or an Array of events when used with ```find()```
* Returns a single numeric value if an aggregator_fnc is used. 

| parameter | type   | details                                            | required | default |
|-----------|--------|----------------------------------------------------|----------|---------|
| aggregator_fnc       | string | Function name to apply to result values. Can be one of the following ["nth", "count", "sum", "avg", "max", "min"]. Using an aggregator will implictly apply a pick rule to the specified  ```aggregator_field``` | no      |     -    |
| aggregator_field      | string  | Field name to apply the function to. Using an aggregator will implictly apply a pick rule to the specified  ```aggregator_field```   | no      |    -    |
| log_query      | bool  | Will console.log the query object    | false      |    -    |

> Based on http://usejsdoc.org/tags-type.html & http://usejsdoc.org/tags-param.html

## Usage

> This will average all of the timestamps across ```click``` events
```
behavior
  .findOne('click')
  .where('page_visibility', 'exists')
  .run('avg', 'time');
```
> This will find all click events where page_visibility tag exists
```
behavior
  .find('click')
  .where('page_visibility', 'exists')
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

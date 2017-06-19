# Optimizely Behavior Queryer

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

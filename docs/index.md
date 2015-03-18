# vx-unit

### Usage

(sample config file)

### Terminology

spec (file) = a file containing one or more tests and one or more test suites
test suite = a collection of tests
test = a piece of logic to exercise some functionality, either results in a PASS or a FAIL

### Retrieving list of loaded spec files

Let's say your vx-http server is running on port 2013.

You can send a GET request to `http://localhost:2013/vx-unit` to a get a list of the loaded spec files.

If you set the accept header to `application/json`, you will get JSON back instead of HTML.

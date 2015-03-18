<!DOCTYPE html>
<html>
<head>
  <title>Server Harness</title>
</head>
<body>
  Tests run on server

  Failed tests: {{failCount}}
  Passed tests: {{passCount}}

  {{#results}}
    a {{.}}
  {{/results}}
</body>
</html>

<!DOCTYPE html>
<html>
<head>
  <title>Sandbox</title>

  {{! @vx-css includes !}}
  {{#css}}
  <style>
    {{{.}}}
  </style>
  {{/css}}
</head>
<body>
  <div id="vx-html-fixtures">
    {{! @vx-html includes !}}
    {{#html}}
    {{{.}}}
    {{/html}}
  </div>

  {{! @vx-script includes !}}
  {{#script}}
  <script>
    {{{.}}}
  </script>
  {{/script}}

  {{! @vx-code includes !}}
  {{#code}}
  <script>
    {{{.}}}
  </script>
  {{/code}}

  {{! spec source !}}
  <script>
    {{{spec}}}
  </script>

</body>
</html>

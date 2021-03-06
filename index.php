<?php if (!isset($_GET['pass']) || $_GET['pass'] !== 'askfirst') die() ?>

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Kartra - Sequence Builder</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css" />
    <style>
      html {
        scrollbar-face-color: #27bdde;
        scrollbar-track-color: #ebebeb;
      }
      .loading-icon {
        position: fixed;
        top: calc(50% - 100px);
        left: calc(50%);
        color: #3792BC;
        font-size: 150px;
      }
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      ::-webkit-scrollbar-thumb {
        background: #27bdde;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        -ms-border-radius: 4px;
        border-radius: 4px;
      }
      ::-webkit-scrollbar-track {
        background: #ebebeb;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        -ms-border-radius: 4px;
        border-radius: 4px;
      }
    </style>
  </head>
  <body>
    <i class="fas fa-spinner fa-spin loading-icon"></i>
    <div id="app"></div>

    <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>
    <script src="/dist/build.js"></script>
  </body>
</html>

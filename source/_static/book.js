$(document).ready(function ()
{
  $("div.configuration-block [class^=highlight-]").hide();
  //$("div.configuration-block [class^=highlight-]").width($("div.configuration-block").width());
  $("div.configuration-block").addClass("jsactive");
  $("div.configuration-block").addClass("clearfix");

  $("div.configuration-block").each(function ()
  {
    var a = $("[class^=highlight-]:first", $(this));
    a.show();
    a.parents("ul:eq(0)").height(a.children('.highlight').height() + 40);

    console.log(a);

  });

  $("div.configuration-block li").each(function ()
  {
    var a = $(":first", $(this)).html();
    $(":first ", $(this)).html("");
    $(":first ", $(this)).append('<a href="#">' + a + "</a>");
    $(":first", $(this)).bind("click", function ()
    {
      $("[class^=highlight-]", $(this).parents("ul")).hide();
      $("li", $(this).parents("ul")).removeClass("selected");
      $(this).parent().addClass("selected");
      var b = $("[class^=highlight-]", $(this).parent("li"));
      b.show();
      b.parents("ul:eq(0)").height(b.children('.highlight').height() + 40);
      return false
    })
  });

  $("div.configuration-block").each(function ()
  {
    $("li:first", $(this)).addClass("selected")
  })
});
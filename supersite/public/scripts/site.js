/* For Blueprint See All Page */
$(document).ready(function(){
    $("div.blueprintContainer a.more").click(function(){
        $(this).toggleClass("open");
        $(this).parent().parent().next().toggleClass("open");
    });

  /* Assigns names to textboxes for blueprint wizard */
  var parentCount = 0;
  var htmlChild = '<div class="child"> <span>Child Page</span> <input type="text" placeholder="Child Page Name" value=""/> <input type="text" placeholder="Child Page Notes" value=""/><a onclick="this.parentNode.remove()" class="removeSpecificSubpage">---</a> </div>';
  $("#pageTable a.addSubpage").click(function () {
    $(htmlChild).insertBefore($(this));
  });
  $("#pageTable a.removeSubpage").click(function () {
    if ($(this).prev().prev().hasClass("parent")) {
      alert("You cannot delete the parent page with this button.");
    } else {
      $(this).prev().prev().remove();
    }
  });
  $("#pageTable a.addParent").click(function () {
    var parentClone = $(this).prev().clone(true, true).find("input:text").val("").end();
    $(parentClone).find("div.child").remove();
    $(parentClone).insertBefore($(this));
  });
  $("#pageTable a.removeParent").click(function () {
    if (!$(this).siblings().eq(1).hasClass("pageInput")) {
      alert("You cannot delete the only parent page");
    } else {
      $(this).prev().prev().remove();
    }
  });
  $("#pageTable a.removeAll").click(function () {
    var countPageInput = $("div.pageInput").length;
    if (countPageInput === 1) {
      alert("You cannot delete the only parent page");
    } else {
      $(this).parent().parent().remove();
    }
  });
  });
  function assignNames() {
    var parentCount = 0;
    var childCount = 0;
    var htmlChild = '<div class="child"> <span>Child Page</span> <input type="text" placeholder="Child Page Name" value=""/> <input type="text" placeholder="Child Page Notes" value=""/><a onclick="this.parentNode.remove()" class="removeSpecificSubpage">---</a> </div>';
    $("#pageTable div.pageInput").each(function () {
      $("#pageTable div.pageInput div.parent").each(function () {
        if (!$(this).next().hasClass("child")) {
          $(htmlChild).insertAfter($(this)).css("display","none");
        }
      });
      childCount = 0;
      $(this).find("input.parentText").attr("name", "blueprint[siteArchitecture][" + parentCount + "][parentPageName]");
      $(this).find("input.parentNotes").attr("name", "blueprint[siteArchitecture][" + parentCount + "][parentPageNotes]");
      $(this).find("div.child").each(function () {
        $(this).find("input:first-of-type").attr("name", "blueprint[siteArchitecture][" + parentCount + "][subpage][" + childCount + "][childPageName]");
        $(this).find("input:last-of-type").attr("name", "blueprint[siteArchitecture][" + parentCount + "][subpage][" + childCount + "][childPageNotes]");
        childCount++;
      });
      parentCount++;
    });
  }
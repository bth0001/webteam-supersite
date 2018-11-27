$(document).ready(function(){
// Removes alert message after 3 seconds
setTimeout(function() {
  $("#alertMessage").fadeOut("slow");
}, 3000);

// For Blueprint See All Page
    $("div.blueprintContainer a.more").click(function(){
        $(this).toggleClass("open");
        $(this).parent().parent().next().toggleClass("open");
    });

// Assigns names to textboxes for blueprint wizard
  var parentCount = 0;
  var htmlChild = '<div class="child"> <span>Child Page</span> <input type="text" placeholder="Child Page Name" value=""/> <input type="text" placeholder="Child Page Notes" value=""/><a onclick="this.parentNode.remove()" class="removeSpecificSubpage"></a> </div>';
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
  //Change title depending on user input
  // $("input.parentText").focusout(function(){
  //   var title = $(this).val();
  //   if (title.length > 0){
  //     $(this).prev().text(title);	
  //   } else {
  //     $(this).prev().text("Parent Page");
  //   }
  // });

  // For image uploader preview 1 of 2
  $("#image").change(function() {
    readURL(this);
  });

// Error Check Blueprint Wizard form
$("#blueprint #submit").click(function(event){
  var empty = [];
  $("#errorScreen").removeClass("open");
  $("#errorScreen div.message ul").empty();
  $("input.highlight").removeClass("highlight");
  $("#blueprint input.main").each(function(){
    if($(this).val() == ""){
      empty.push($(this).attr("aria-label"));
    }
  });
  if(empty.length > 0){
    $("#errorScreen").addClass("open");
    $("#overlay").show();
    for(i = 0; i < empty.length; i++) {
      $("<li><a class='goto'>"+empty[i]+"</a></li>").appendTo("#errorScreen div.message ul");
    }
    $("#errorScreen a.goto").bind("click", function(){
      var html = $(this).html();
      $("#errorScreen").removeClass("open");
      $("#overlay").hide();
      $("input[aria-label*='"+html+"']").addClass("highlight");
      $([document.documentElement, document.body]).animate({
	      scrollTop: $("input[aria-label*='"+html+"']").offset().top-100
      }, 750);
      setTimeout(function(){
        $("input[aria-label*='"+html+"']").removeClass("highlight");
      }, 5000);
    });
    $("#errorScreen a.yes").click(function(){
      $("#blueprint").submit();
      return true
    });
    $("#errorScreen a.no").click(function(){
      $("#errorScreen").removeClass("open");
      $("#overlay").hide();
    });
  } else {
    $("#blueprint").submit();
      return true
  }
});
$("#blueprint input").focus(function(){
  $(this).removeClass("highlight");
});

// Adds doctor names depending on selection
$("#howManyDoctors").change(function () {
  $("#howManyDoctorsContainer").empty();
  for(i = 0; i < $(this).val(); i++) {
    $('<div class="formField"><input type="text" name="blueprint[doctor]" placeholder="Doctor Name" /></div>').appendTo("#howManyDoctorsContainer");
  }
});
// Adds office locations depending on selection
$("#howManyOffices").change(function () {
  $("#howManyOfficesContainer").empty();
  for(i = 0; i < $(this).val(); i++) {
    $('<div class="formField officeAddress"><input class="text" type="text" placeholder="Address" /><input type="text" class="number" placeholder="Building/Suite #" /><input type="text" class="city" placeholder="City" /><input type="text" class="state" placeholder="State" /><input type="text" class="zip" placeholder="Zip Code" /></div>').appendTo("#howManyOfficesContainer");
  }
});
// Toggles social media input screen
$("#enterSocialMedia").click(function(){
  $("#socialMedia").addClass("open");
  $("#overlay").show();
});
$("#socialMedia a.close, #socialMedia a.submit").click(function(){
  $("#socialMedia").removeClass("open");
  $("#socialMediaPreview ul").empty();
  $("#overlay").hide();
  var socialMedia = []
  var emptycount = 0;
  $("#socialMedia div.cell input.url").each(function(){
    if(!$(this).val() == ""){
      emptycount++
      var socialsite = $(this).prev().val();
      var sociallink = $(this).val();
      $("<li>"+socialsite+": <a target='_blank' href='"+sociallink+"'>"+sociallink+"</a></li>")
        .appendTo("#socialMediaPreview ul");
    }
  });
  if (emptycount > 0){
    $("#enterSocialMedia").text("Edit Social Media");
  } else {
    $("#enterSocialMedia").text("Add Social Media");
  }
});

  // Audit History Toggle for show pages that have history enabled
  $("#auditHistory").on("click", function(){
    $("div.auditHistory").addClass("visible");
    $("#pageOverlay").show();
  });
  $("div.auditHistory a.close").on("click", function(){
    $("div.auditHistory").removeClass("visible");
    $("#pageOverlay").hide();
  });
  // Will add a class on audit history hover
  $("div.auditHistory a.user").on("mouseover focusin", function(){
    var value = $(this).attr("href");
    $("div.auditHistory a.user").each(function(){
      if (value === $(this).attr("href")){
        $(this).addClass("highlight");
      }
    });
    $("div.auditHistory a.user").on("mouseout focusout", function(){
      $("div.auditHistory a.user").each(function(){
        $(this).removeClass("highlight");
      });
    });
  });

  $("#search input").on("keyup", function(){
    var searchString = $(this).val();
    if(searchString.length > 0){
     $.get("/quick-search", {search: searchString}, function(data, status){
       console.log(data);
       $("#quickSearch>ul>li").remove();
        if(data.tracking.length){
          for (var key in data.tracking) {
             var value = data.tracking[key];
             $("<li><a href='/tracker/"+value._id+"'>"+value+"</a></li>").appendTo("#quickSearch ul");
          }
        } else {
          $("<li>No Results Found</li>").appendTo("#quickSearch ul");
        }
      }); 
    } else {
      $("#quickSearch>ul>li").remove();
    }
  });


});//End document ready
  
  function assignNames() {
    var parentCount = 0;
    var childCount = 0;
    var htmlChild = '<div class="child"> <span>Child Page</span> <input type="text" placeholder="Child Page Name" value=""/> <input type="text" placeholder="Child Page Notes" value=""/><a onclick="this.parentNode.remove()" class="removeSpecificSubpage"></a> </div>';
    $("#pageTable div.pageInput").each(function () {
      $("#pageTable div.pageInput div.parent").each(function () {
        if (!$(this).next().hasClass("child")) {
          $(htmlChild).insertAfter($(this)).css("display","none");
        }
      });
      childCount = 0;
      if(!$(this).find("input.parentText").val() == ""){
        $(this).find("input.parentText").attr("name", "blueprint[siteArchitecture][" + parentCount + "][parentPageName]");
      }
      if(!$(this).find("input.parentNotes").val() == ""){
        $(this).find("input.parentNotes").attr("name", "blueprint[siteArchitecture][" + parentCount + "][parentPageNotes]");
      }
      $(this).find("div.child").each(function () {
        if(!$(this).find("input:first-of-type").val() == ""){
          $(this).find("input:first-of-type").attr("name", "blueprint[siteArchitecture][" + parentCount + "][subpage][" + childCount + "][childPageName]");
        }
        if(!$(this).find("input:last-of-type").val() == ""){
          $(this).find("input:last-of-type").attr("name", "blueprint[siteArchitecture][" + parentCount + "][subpage][" + childCount + "][childPageNotes]");
        }
        childCount++;
      });
      parentCount++;
    });
    // assigns names to social media
    var smcount = 1;
    $("#socialMedia div.cell input.url").each(function(){
      if(!$(this).val() == ""){
        $(this).prev().attr("name", "blueprint[socialMedia]["+smcount+"][name]");
        $(this).attr("name", "blueprint[socialMedia]["+smcount+"][link]");
        smcount++;
      }
    });
    var doctorcount = 1;
    $("#howManyDoctorsContainer input").each(function(){
      if(!$(this).val() == ""){
        $(this).attr("name", "blueprint[doctors]["+doctorcount+"][doctorName]");
        doctorcount++;
      }
    });
    // Count and assigns names to office input
    var officecount = 0;
    $("#howManyOfficesContainer div.officeAddress").each(function(){
      if(!$(this).children().eq(0).val() == ""){
        $(this).children().eq(0).attr("name", "blueprint[officeAddress]["+officecount+"][address]");
      }
      if(!$(this).children().eq(1).val() == ""){
        $(this).children().eq(1).attr("name", "blueprint[officeAddress]["+officecount+"][number]");
      }
      if(!$(this).children().eq(2).val() == ""){
        $(this).children().eq(2).attr("name", "blueprint[officeAddress]["+officecount+"][city]");
      }
      if(!$(this).children().eq(3).val() == ""){
        $(this).children().eq(3).attr("name", "blueprint[officeAddress]["+officecount+"][state]");
      }
      if(!$(this).children().eq(4).val() == ""){
        $(this).children().eq(4).attr("name", "blueprint[officeAddress]["+officecount+"][zip]");
      }
        officecount++;
    }); 
  }

  // For image uploader preview 2 of 2
  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
  
      reader.onload = function(e) {
        $('#imagePreview').attr('src', e.target.result);
      }
  
      reader.readAsDataURL(input.files[0]);
    }
  }
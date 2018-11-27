$(document).ready(function () {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    $("#startDate").val(firstDay.toISOString().substr(0, 10));
    $("#endDate").val(lastDay.toISOString().substr(0, 10));
    getDashboardData();
    $("#dateFilter input, #allTeamMembers input").on("change", function () {
        getDashboardData();
    });
    // Team/user dropdown to filter data
    $("#allTeamMembers > li > a").on("click", function () {
        if ($(this).hasClass("checked")) {
            $(this).removeClass("checked");
            $(this).next().find("a").removeClass("checked");
            $(this).next().find("input").prop("checked", false);
        } else {
            $(this).addClass("checked");
            $(this).next().find("a").addClass("checked");
            $(this).next().find("input").prop("checked", true);
        }
        assignNames();
        getDashboardData();
    });
    $("#allTeamMembers ul a").on("click", function () {
        $("h4.activeUser").text($(this).text());
        if ($(this).hasClass("checked")) {
            $(this).removeClass("checked");
            $(this).next().prop("checked", false);
        } else {
            $(this).addClass("checked");
            $(this).next().prop("checked", true);
        }
        assignNames();
        getDashboardData();
    });

    function assignNames() {
        var activeArray = [];
        var count = 0;
        $("#allTeamMembers ul a").each(function () {
            if ($(this).hasClass("checked")) {
                var name = $(this).text();
                activeArray.push(name);
                count++;
            }
            if (count > 0) {
                $("h4.activeUser").text(activeArray.join(", "));
            } else {
                $("h4.activeUser").text("No User Selected");
            }
        });
    }

    // Toggle for accordion on dashboard
    $("#bottomRow").on("click", "a", function () {
        var elem = $(this);
        if (elem.is("[class*='arrow']")) {
            $(this).toggleClass("open");
            $(this).parent().next().slideToggle(300);
        }
    });

    // Arrows on the dahboard to allow sorting of data
		$("#bottomRow").on("click", "a", function () {
			var elem = $(this);
			if($(this).attr("data-sort") === "ascending"){
				$(this).attr("data-sort","descending");
			} else {
				$(this).attr("data-sort","ascending");
			}
        	if (elem.is("[data-sort]")) {
				var sort = $(this).parent().attr("class");
				sort = sort.replace("cell ","");
				var sortArray = [];
				$(this).parents(".table").find(".data div."+sort).each(function(){
					sortArray.push($(this).text());
				});
				if($(this).attr("data-sort") === "ascending"){
					// Ascending
					sortArray = sortArray.sort(function (a, b) {
						return a.toLowerCase().localeCompare(b.toLowerCase());
					});
				} else {
					// Descending 
					sortArray = sortArray.sort(function (a, b) {
						return b.toLowerCase().localeCompare(a.toLowerCase());
					});
				}
				$(sortArray).each(function(sortNum){
					elem.parents(".table").find(".data div."+sort).each(function(){
						var text = $(this).text().toLowerCase();
						if(text === sortArray[sortNum].toLowerCase()){
							$(this).parent().css("order",sortNum+2);
						}
					});
				});
        	}
    	});

        // Circle numbers that Toggles corresponding table
				$("#topRow a").on("click", function(){
					var elem = $(this);
        			if (elem.is("[data-toggle='show']")) {
						var build = $(this).attr("class");
						if($(this).attr("data-expand") === "open"){
							$(this).attr("data-expand","closed");
						} else {
							$(this).attr("data-expand","open");
						}
						var count = 0;
						$("#topRow a[data-expand]").each(function(){
							if($(this).attr("data-expand") === "open"){
								count++
							}
						});
						if(count>0){
								$("#bottomRow .quickSearch").slideDown("slow")
							} else {
								$("#bottomRow .quickSearch").slideUp("slow")
						}
						$("#bottomRow div.dashboardAccordion").each(function(){
							//if(!$(this).hasClass("open")){
								if($(this).hasClass(build)){
									$(this).slideToggle("slow").toggleClass("open")
								}
							//}
						});
					}
                });
                
                // Filters data on the dashboard once pulled from server
                $("#filterTracked").on("keyup", function(){
                    var searchString = $(this).val().toString().toLowerCase();
                    console.log(searchString);
                        if(searchString.length > 0){
                        //#bottomRow div.table div.data
                        $("#bottomRow").find("div.data.row").each(function(){
                            $(this).children(".cell").each(function(){
                                var search = $(this).text().toString().toLowerCase();
                                var exist = search.includes(searchString);
                                if(exist === true){
                                    $(this).attr("data-match","true");
                                } else {
                                    $(this).attr("data-match","false");
                                }
                                $(this).parent().hide();
                            });
                        });
                        $("#bottomRow div[data-match]").each(function(){
                            if($(this).attr("data-match") === "true"){
                                $(this).parent().show();
                            }
                        });
                        } else {
                            $("#bottomRow div.data.row").show();
                            $("#bottomRow div[data-match]").each(function(){
                                $(this).attr("data-match","false");
                            });
                        }
                });

});

// Grabs information from database depending on user selection
function getDashboardData() {
    var userList = [];
    var startDateInput = $("input#startDate").val();
    var endDateInput = $("input#endDate").val();
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + (month) + "-" + (day);
    $("#allTeamMembers input").each(function () {
        if (this.checked) {
            userList.push($(this).val());
        }
    });
    $.get("/api", {
        startDate: startDateInput,
        endDate: endDateInput,
        users: userList
    }, function (data, status) {
        $("#topRow a[data-expand]").each(function(){
            $(this).attr("data-expand","closed");
        });
        $("#bottomRow .quickSearch").hide();
        $("#bottomRow .quickSearch input").val("");
        $("#dashboard #bottomRow .widget").empty();
        $("#bottomRow .row.data").remove();
        if (data.length) {
            //create variables
            var buildNamesArray = [];
                data.forEach(function (name) {
                    if (buildNamesArray.indexOf(name.buildPkg) === -1) {
                        buildNamesArray.push(name.buildPkg)
                    }
                });
                buildNamesArray.forEach(function(package) {
                    var count = 0;
                    data.forEach(function (name) {
                        if(package === name.buildPkg && !name.archive){
                            count++
                        }
                    });
                    if(count>0){
                        $("#topRow a[data-toggle='show']."+package.toLowerCase()+" span").text(count)
                    } else {
                        $("#topRow a[data-toggle='show']."+package.toLowerCase()+" span").text("0");
                    }
                });
            //Create HTML and append to Bottom Section
            var taskArray = [];
            data.forEach(function (taskName) {
                if (taskArray.indexOf(taskName.buildPkg) === -1) {
                    taskArray.push(taskName.buildPkg)
                }
            });
            taskArray.forEach(function (name) {
                $(`<div style="display: none;" class="dashboardAccordion ${name.toLowerCase()}"><h2>${name}</h2><div class="table" style="display: flex; flex-wrap: wrap;">
                    <div class="row title flexbox" style="order: 1; flex: 1 100%;">
                        <div class="cell url">Website URL<a href="javascript:void(0);" data-sort="none"></a></div>
                        <div class="cell actNumber">Account Number<a href="javascript:void(0);" data-sort="none"></a></div>
                        <div class="cell developer">Developer<a href="javascript:void(0);" data-sort="none"></a></div>
                        <div class="cell designer">Designer<a href="javascript:void(0);" data-sort="none"></a></div>
                        <div class="cell date">Date<a href="javascript:void(0);" data-sort="none"></a></div>
                        <div class="cell arrow"></div>
                    </div></div></div>`).appendTo("#bottomRow .widget");
                //loop through data
                var flexOrder = 2;
                data.forEach(function (dataoutput) {
                    if (name.toString() === dataoutput.buildPkg.toString() && !dataoutput.archive) {
                        $(`<div class="row data flexbox" style="order: ${flexOrder}; flex: 1 100%;">
                            <div class="cell url"><a href="${dataoutput.domain}" target="_blank">${dataoutput.domain}</a></div>
                            <div class="cell actNumber">${dataoutput.acctNum}</div>
                            <div class="cell developer">${dataoutput.author.firstName}</div>
                            <div class="cell designer">${dataoutput.designer}</div>
                            <div class="cell date" data-date="${dataoutput.created_at}">${moment(dataoutput.created_at).format("MMM DD, YYYY")}</div>
                            <div class="cell arrow"><a class="arrow" href="javascript:void(0);"><i class="fas fa-angle-down"></a></i></div>
                            <div class="expanded" style="display:none">
                                <p><strong>Home Screenshot:</strong> <a href="${dataoutput.homeSS}" target="_blank">${dataoutput.homeSS}</a></p>
                                <p><strong>Interior Screenshot:</strong> <a href="${dataoutput.interiorSS}" target="_blank">${dataoutput.interiorSS}</a></p>
                                <p><strong>Special Features:</strong>${dataoutput.specialFeatures}</p>
                                <p><strong>CSS Path:</strong>${dataoutput.cssPath}</p>
                                <p><strong>Task:</strong></p>
                                <p><strong>Notes:</strong>${dataoutput.notes}</p>
                            </div>
                            </div>`).appendTo("#bottomRow .dashboardAccordion:last-of-type .table");
                            flexOrder++;
                    }
                });
            });

        } else {
            $("#topRow a[data-toggle='show'] span").html("0");
        }
    });
}
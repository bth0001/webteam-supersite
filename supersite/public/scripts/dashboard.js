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
        $("#dashboard #bottomRow .widget").empty();
        $("#bottomRow .row.data").remove();
        var essCount, strCount, prodCount, tlinkCount, contentCount, projectCount;
        essCount = strCount = prodCount = tlinkCount = contentCount = projectCount = 0;
        if (data.length) {
            console.log(data);
            //create variables
            for (var key in data) {
                var value = data[key];
                // Count Essential
                if (value.buildPkg === "Essential" && !value.archive) {
                    essCount++
                }
                // Count Starter
                if (value.buildPkg === "Starter" && !value.archive) {
                    strCount++
                }
                // Count Prod Changes
                if (value.taskTypes.taskTypeName === "Production Change") {
                    prodCount++
                }
                // Count T Link
                if (value.taskTypes.taskTypeName === "T.LINK Branding") {
                    tlinkCount++
                }
                // Count Content Entry
                if (value.taskTypes.taskTypeName === "Content Entry") {
                    contentCount++
                }
                //Count Projects Completed
                if (value.buildPkg === "Essential") {
                    projectCount++
                }
            }
            //Update Top Row Stats
            $("#topRow .showEssentials").html(essCount);
            $("#topRow .showStarter").html(strCount);
            $("#topRow .showProd .taskNumber").html(prodCount);
            $("#topRow .showTlink .taskNumber").html(tlinkCount);
            $("#topRow .showContent .taskNumber").html(contentCount);
            $("#topRow .showShowProject .taskNumber").html(projectCount);

            //Create HTML and append to Bottom Section
            var taskArray = [];
            data.forEach(function (taskName) {
                if (taskArray.indexOf(taskName.buildPkg) === -1) {
                    taskArray.push(taskName.buildPkg)
                }
            });
            taskArray.forEach(function (name) {
                $(`<div style="display: none;" class="dashboardAccordion" id="dash${name}"><h2>${name}</h2><div class="table">
                    <div class="row title flexbox">
                    <div class="cell url">Website URL</div>
                    <div class="cell actNumber">Account Number</div>
                    <div class="cell name">Developer</div>
                    <div class="cell name">Designer</div>
                    <div class="cell date">Date</div>
                    <div class="cell arrow"></div>
                    </div></div></div>`).appendTo("#bottomRow .widget");
                //loop through data
                data.forEach(function (dataoutput) {
                    if (name.toString() === dataoutput.buildPkg.toString() && !dataoutput.archive) {
                        $(`<div class="row data flexbox">
                            <div class="cell url"><a href="${dataoutput.domain}" target="_blank">${dataoutput.domain}</a></div>
                            <div class="cell actNumber">${dataoutput.acctNum}</div>
                            <div class="cell name">${dataoutput.author.firstName}</div>
                            <div class="cell name">${dataoutput.designer}</div>
                            <div class="cell date">${moment(dataoutput.created_at).format("MMM DD, YYYY")}</div>
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
                    }
                });
            });

        } else {
            $("#topRow .showEssentials").html("0");
            $("#topRow .showStarter").html("0");
            $("#topRow .showProd .taskNumber").html("0");
            $("#topRow .showTlink .taskNumber").html("0");
            $("#topRow .showContent .taskNumber").html("0");
            $("#topRow .showShowProject .taskNumber").html("0");
        }
    });
}
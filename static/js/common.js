function ajax_(url, payload, callback) {
    $.ajax({
        type: "POST",
        url: url,
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(payload),
        success: function(data) {
            callback(data);
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log(xhr, ajaxOptions, thrownError);
        }
    });
}

$(document).ready(function() {
    const curr_path = window.location.pathname;
    if (curr_path === '/') {
        $('#head-navbar').hide()
        $('#nav-links').hide()
    }
    links();
});

function createElement(element, content) {
    element = document.createElement(element);
    if (arguments.length > 1) {
        element.innerHTML = content;
    }
    return element;
}

function links() {
    let all_links = document.getElementById("nav-links").getElementsByTagName("a");
    console.log(all_links);

    let full_path = location.href.split('#')[0]; //Ignore hashes?

    // Loop through each link.
    for(i=0; i<all_links.length; i++) {
        if(all_links[i].href.split("#")[0] == full_path) {
            all_links[i].className += " active";
        }
    }
}

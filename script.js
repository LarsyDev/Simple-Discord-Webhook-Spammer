let counter = 0;

const params = new URLSearchParams(window.location.search);

$(document).ready(_ => {
    if(params.get("url") != null){
        $("input")[0].value = params.get("url");
    }
    if(params.get("msg") != null){
        $("input")[1].value = params.get("msg");
    }
});

let save = _ => {
    window.location.search = "?msg="+$("input")[1].value+"&url="+$("input")[0].value;
}

let url;
let msg;
let rate;
let cooldown;

let submit = _ => {
    url = $("input")[0].value;
    msg = $("input")[1].value;
    rate = $("input")[2].value;
    cooldown = $("input")[3].value;

    log("SYS", "Attempting to send '" + msg + "' to '" + url + "' every " + rate + "ms")
    send();
}

let send = _ => { 
    $("button")[1].disabled = true;

    $.ajax({
        type: "POST", url: url, async: true,
        data: { content: msg },
        complete: e => {
            if(e.status == 204){
                counter++;
                log(e.status, "Larsy | Sent " + counter.toLocaleString() + " messages");
                setTimeout(send, rate);
            }else if(e.status == 429){
                log(e.status, "Larsy | You are being rate-limited");
                log("SYS", "Taking a " + cooldown + "ms break...");
                setTimeout(send, cooldown);
            }else {
                if(e.status == 404) log(e.status, "Larsy | Webhook not found");
                if(e.status == 0) log(e.status, "AJAX request failed");
                log("SYS", "Reattempting...");
                setTimeout(send, rate);
            }
        }
    });
}

let logtext = [];
let log = (code, log) => {
    let day = new Date().toString().split(" ")[4];
    logtext.unshift("<b>" + day + "</b> -- [" + code + "] " + log);
    if(logtext.length > 50) logtext.pop();
    $("code").html(logtext.join("<br>"));
}



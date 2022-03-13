console.log("JS has started");

var points = 0
var counter = 0;

function loadpoints(points) {

    document.getElementById("points").innerHTML = points + " points"

}

loadpoints(0);

var priceofnftusd;


var totalpoints = [];


function call() {

    console.clear()


    $.ajax({
        url: "https://deep-index.moralis.io/api/v2/nft/search?chain=eth&format=decimal&q=expensive&filter=name",
        beforeSend: function(xhr) {
            xhr.setRequestHeader("X-API-Key", "vEFk3lMSzGtLBmcVRZA51UNYg5sg38bSyTkMj5oWsQGgWMnLfYzKq1BrMlgkc0dK");
        },
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        processData: false,
        success: function(data) {

            /**/

            var toplimit = data.result.length
            var randomtokenn = Math.floor(Math.random() * toplimit);

            //nft adress
            var adress = data.result[randomtokenn].token_address

            var metadata = data.result[randomtokenn].metadata
            var JSONmetaobj = JSON.parse(metadata);

            //image url
            var Jsonimagestring = JSONmetaobj.image.toString()

            //nft name
            var JsonNameofToken = JSONmetaobj.name

            //console.log(randomadress)
            console.log(randomtokenn)

            //console.log(adress)
            console.log(JsonNameofToken)

            if (Jsonimagestring.includes("ipfs://")) {
                call()
            } else {
                console.log(JSONmetaobj.image)
                    //document.getElementById("imgobj").src = JSONmetaobj.image;
            }


            //Get nft price
            $.ajax({
                url: "https://deep-index.moralis.io/api/v2/nft/" + adress + "/trades?chain=eth&marketplace=opensea",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("X-API-Key", "vEFk3lMSzGtLBmcVRZA51UNYg5sg38bSyTkMj5oWsQGgWMnLfYzKq1BrMlgkc0dK");
                },
                type: 'GET',
                dataType: 'json',
                contentType: 'application/json',
                processData: false,
                success: function(prices) {

                    /**/

                    var price = (prices.result[0].price) / Math.pow(10, 18);
                    2


                    //console.log(price + " ETH")


                    //Convert from ETH to USD

                    $.ajax({
                        url: "https://api.etherscan.io/api?module=stats&action=ethprice&apikey=X9F42P4PTPP3XSWD3CAIWN99TUR63GXQ75",
                        type: 'GET',
                        dataType: 'json',
                        contentType: 'application/json',
                        processData: false,
                        success: function(ethdata) {

                            /**/

                            //load stuff into the HTML
                            document.getElementById("infocuadro").innerHTML = JsonNameofToken;
                            document.getElementById("nftimage").src = Jsonimagestring;



                            var ethusdprice = ethdata.result.ethusd
                            priceofnftusd = ethusdprice * price
                            priceofnftusd = Math.round(priceofnftusd)

                            //console.log(priceofnftusd + "$")
                            document.getElementById("revelarprecio").innerHTML = priceofnftusd + "$ -- " + price + " ETH"




                        },
                        error: function() {
                            alert("Error getting the price of ETH in dollars");
                        }
                    });


                },
                error: function() {
                    alert("Error getting the price");
                }
            });

        },
        error: function() {
            alert("An error has ocurred, refresh the page or contact the developer");
        }
    });

}


function load() {

    //hidde div
    document.getElementById("revelarprecio").style.visibility = "hidden"

    //allow user to type price
    document.getElementById("userpriceinp").readOnly = false;
    document.getElementById("enviar").disabled = false;

    //call function
    call()
}

function showprice() {

    document.getElementById("revelarprecio").style.visibility = "visible"

    //block writting tag
    document.getElementById("enviar").disabled = true;

    //get input price
    var userinputelement = document.getElementById("userpriceinp");
    var userinputext = parseInt(userinputelement.value);
    //console.log(userinputext)

    userinputelement.readOnly = true
    var score = 0

    score = (1000 / priceofnftusd) * userinputext;

    if (score > 1000) {

        score = 2000 - score
    }


    if (score < 0) {

        score = 0
    }

    score = Math.round(score)

    totalpoints.push(score)
        //console.log(totalpoints)

    var totalp = 0

    totalpoints.forEach(localscore => {
        totalp = localscore + totalp
    });



    console.log("Score: " + score)
    console.log("TotalPoints: " + totalp)

    loadpoints(totalp)
    document.getElementById("addedpoints").innerHTML = "+" + score;


}

//n
$(document).keyup(function(e) {
    if ($(".input1:focus") && (e.keyCode === 78)) {

        //recall function
        load()

        //reset user input
        document.getElementById("userpriceinp").value = "";
        document.getElementById("addedpoints").innerHTML = "";

        //counter +1
        counter = counter + 1

        document.getElementById("rondas").innerHTML = "Round " + counter

    }
});


//enter
$(document).keyup(function(e) {
    if ($(".input1:focus") && (e.keyCode === 13)) {

        showprice()


    }
});

//r
$(document).keyup(function(e) {
    if ($(".input1:focus") && (e.keyCode === 82)) {

        location.reload()


    }
});



window.onload = load();
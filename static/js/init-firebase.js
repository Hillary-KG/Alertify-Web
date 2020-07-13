// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyA-atkaTHhE-fJm7hcr4njC4_elRa3DrnQ",
    authDomain: "citispy-91191.firebaseapp.com",
    databaseURL: "https://citispy-91191.firebaseio.com",
    projectId: "citispy-91191",
    storageBucket: "citispy-91191.appspot.com",
    messagingSenderId: "629555630146",
    appId: "1:629555630146:web:53153b172b74c280559ddb",
    measurementId: "G-TNXTNTCWG5"
};

// Initialize Firebase
var firebaseProj = firebase.initializeApp(firebaseConfig);

var database = firebaseProj.database()
const alertsRef = database.ref('alerts/')
const messaging = firebase.messaging()

// function sendNotification() {
//     var token = messaging.getToken()

//     $.ajax({        
//         type : 'POST',
//         url : "/fcm/fcmpush",

//         contentType : 'application/json',
//         dataType: 'json',
//         data: JSON.stringify({"alert": {"title":"Test","body":"Test"}}),
//         success : function(response) {
//             console.log(response);
//         },
//         error : function(xhr, status, error) {
//             console.log(xhr.error);                   
//         }
//     });
// }

function populateTable() {
    var content = '';
    var totalCount = 0;
    var totalPending = 0;

    alertsRef.once(
        'value').then(function (snapshot) {
            // updateStarCount(postElement, snapshot.val());
            // console.log("New Here", snapshot.val())
            snapshot.forEach(function (childSnapshot) {
                // content += '<tr>';
                content += '<tr><td>' + childSnapshot.child('time').val() + '</td>';
                content += '<td>' + childSnapshot.child('user').child('first_name').val() + ' ' + childSnapshot.child('user').child('last_name').val() + '</td>';
                content += '<td>' + childSnapshot.child('user').child('phone_number').val() + '</td>';
                content += '<td>' + childSnapshot.child('location').val() + '</td></tr>';
                // content += ''

                // console.log("time", childSnapshot.child('user').child('phone_number').val())
                totalCount += 1;
                if (childSnapshot.child('status').val() === "pending") {
                    totalPending++;
                }
            });
            // $('#alertsNo').text(totalPending);
            $('#totalAlerts').text(totalCount);
            $('#pendingCount').text(totalPending);
            $('#totalCount').text(totalCount);
            $("#alertsTable tbody").html(content);
        });
}

alertsRef.orderByChild('time').limitToLast(1).on(
    'child_added',
    function (snapshot) {
        readDataChange(snapshot)
    }
);
function readDataChange(snapshot) {
    console.log("New Here", snapshot.val())
    $("<tr><td>" + snapshot.child('time').val() + "</td><td>" + snapshot.child('user').child('first_name').val() + "</td><td>" +
        snapshot.child('user').child('last_name').val() +
        "</td><td>" + snapshot.child('location').val() + "</td></tr>").css({
            'background': 'red',
            'animation': 'flash 3s forwards linear normal;'
        }).prependTo("#alertsTable tbody");
    var new_alert = parseInt($('#alertsNo').text()) + 1;
    $('#alertsNo').text(new_alert);
}

// readDataChange()
populateTable()

$('#alertsNo').click(function (e) {
    e.preventDefault();
    $(this).text("0");
})


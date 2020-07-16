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

    var $dataArray = []
    var $labelsArray = []

    alertsRef.once(
        'value').then(function (snapshot) {
            // updateStarCount(postElement, snapshot.val());
            // console.log("New Here", snapshot.val())
            snapshot.forEach(function (childSnapshot) {
                content += '<tr><td>' + childSnapshot.child('time').val() + '</td>';
                content += '<td>' + childSnapshot.child('type').val() + '</td>';
                content += '<td>' + childSnapshot.child('user').child('first_name').val() + ' ' + childSnapshot.child('user').child('last_name').val() + '</td>';
                content += '<td>' + childSnapshot.child('user').child('phone_number').val() + '</td>';
                content += '<td>' + childSnapshot.child('location').val() + '</td></tr>';

                totalCount += 1;
                if (childSnapshot.child('status').val() === "pending") {
                    totalPending++;
                }
            });
            // totalCount = 0;
            // $('#alertsNo').text(totalPending);
            $('#totalAlerts').text(totalCount);
            $('#pendingCount').text(totalPending);
            $('#totalCount').text(totalCount);
            $("#alertsTable tbody").html(content);
        });
}

function createChart() {
    var $dataArray = []
    var $labelsArray = []

    var ctx = $('#alertsChart')
    
    alertsRef.once(
        'value').then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                $labelsArray.push(childSnapshot.child('location').val());
            });
        });
    $labelsArray.forEach(element => {
        $dataArray.push($labelsArray.filter(element => element === element))
    });
    console.log("data ===>", $dataArray);

    var $options = {}

    var $data = {
        datasets: [
            {
                data: $dataArray
            }
        ],

        labels: $labelsArray
    }


    var $donChart = new Chart(ctx, {
        type: 'doughnut',
        data: $data,
        options: $options
    });


    // var ctx = $('#alertsChart');
    // var alertsChart = new Chart(ctx, {
    //     type: 'bar',
    //     data: {
    //         labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    //         datasets: [{
    //             label: '# of Votes',
    //             data: [12, 19, 3, 5, 2, 3],
    //             backgroundColor: [
    //                 'rgba(255, 99, 132, 0.2)',
    //                 'rgba(54, 162, 235, 0.2)',
    //                 'rgba(255, 206, 86, 0.2)',
    //                 'rgba(75, 192, 192, 0.2)',
    //                 'rgba(153, 102, 255, 0.2)',
    //                 'rgba(255, 159, 64, 0.2)'
    //             ],
    //             borderColor: [
    //                 'rgba(255, 99, 132, 1)',
    //                 'rgba(54, 162, 235, 1)',
    //                 'rgba(255, 206, 86, 1)',
    //                 'rgba(75, 192, 192, 1)',
    //                 'rgba(153, 102, 255, 1)',
    //                 'rgba(255, 159, 64, 1)'
    //             ],
    //             borderWidth: 1
    //         }]
    //     },
    //     options: {
    //         scales: {
    //             yAxes: [{
    //                 ticks: {
    //                     beginAtZero: true
    //                 }
    //             }]
    //         }
    //     }
    // });

    // ctx.html(alertsChart);
}

alertsRef.orderByChild('time').startAt(Date.now()).limitToLast(1).on(
    'child_added',
    function (snapshot) {
        readDataChange(snapshot)
    }
);
function readDataChange(snapshot) {
    console.log("New Here", snapshot.child('time').val())
    var alert_info = '';

    // content += '<tr>';
    alert_info += '<div><p><strong>Tine In: </strong>' + snapshot.child('time').val() + '</p>';
    alert_info += '<div><p><strong>Type : </strong>' + snapshot.child('type').val() + '</p>';
    alert_info += '<p><strong>Raised by:</strong>' + snapshot.child('user').child('first_name').val() + ' ' + snapshot.child('user').child('last_name').val() + '</p>';
    alert_info += '<p><strong>Raiser Phone number:</strong>' + snapshot.child('user').child('phone_number').val() + '</p>';
    alert_info += '<p><strong>Location: </strong>' + snapshot.child('location').val() + '</p></div>';

    $("#alertModal").find("#alertPanel").html(alert_info);
    $("#alertModal").modal('show');

    $("<tr><td>" + snapshot.child('time').val() + "</td><td>" + snapshot.child('type').val() + "</td><td>" + snapshot.child('user').child('first_name').val() +
    " "+snapshot.child('user').child('last_name').val()+"</td><td>" + snapshot.child('user').child('phone_number').val() + "</td><td>" + snapshot.child('location').val() + "</td></tr>").css({
            'background': 'red',
            'animation': 'flash 3s forwards linear normal;'
        }).prependTo("#alertsTable tbody");
    var new_alert = parseInt($('#alertsNo').text()) + 1;
    $('#alertsNo').text(new_alert);
}

// readDataChange()
populateTable()

createChart()

$('#alertsNo').click(function (e) {
    e.preventDefault();
    $(this).text("0");
})
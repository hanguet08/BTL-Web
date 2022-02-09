var username = localStorage.getItem('username')
var roles = localStorage.getItem('roles')
var province = localStorage.getItem('province')
var district = localStorage.getItem('district')
var ward = localStorage.getItem('ward')
var hamlet = localStorage.getItem('hamlet')
var accToken = localStorage.getItem('accToken')
var active = localStorage.getItem('active')
var complete = localStorage.getItem('complete')


$(document).ready(function() {

    start()
})

function start() {
    $('.logout p').html(username)

    renderNavbar()
    var render = new Promise((resolve, reject) => {
        a = get_data("http://localhost:3000/statistical")
        console.log(a)
        resolve(a)
    });

    render
        .then(function(a) {
            var b = Object.values(a)
            var text = "";
            if (hamlet != "") {
                text = "Biểu đồ phân bố dân cư theo độ tuổi " + hamlet
            } else if (ward != "") {
                text = "Biểu đồ phân bố dân cư theo độ tuổi " + ward
            } else if (district != "") {
                text = "Biểu đồ phân bố dân cư theo độ tuổi " + district
            } else {
                text = "Biểu đồ phân bố dân cư theo độ tuổi " + province
            }

            let myChart = document.getElementById('myChart').getContext('2d');
            // Global Options
            Chart.defaults.global.defaultFontFamily = 'Lato';
            Chart.defaults.global.defaultFontSize = 18;
            Chart.defaults.global.defaultFontColor = '#777';

            let massPopChart = new Chart(myChart, {
                type: 'bar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
                data: {
                    labels: ['(0,10)', '(10,20)', '(20,30)', '(30,40)', '(40,50)', '(50,60)', '(60,70)', '(70,80)', '(80,90)', '(90,100)', ">100"],
                    datasets: [{
                        label: 'Population',
                        data: b,
                        //backgroundColor:'green',
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(153, 102, 255, 0.6)',
                            //  'rgba(255, 159, 64, 0.6)',
                            //  'rgba(255, 99, 132, 0.6)'
                        ],
                        borderWidth: 1,
                        borderColor: '#777',
                        hoverBorderWidth: 3,
                        hoverBorderColor: '#000'
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: text,
                        fontSize: 25
                    },
                    legend: {
                        display: true,
                        position: 'right',
                        labels: {
                            fontColor: '#000'
                        }
                    },
                    layout: {
                        padding: {
                            left: 50,
                            right: 0,
                            bottom: 0,
                            top: 0
                        }
                    },
                    tooltips: {
                        enabled: true
                    }
                }
            });

        })
        .then(function() {

            filter()
            renderFilter()

        })

}



function change_password() {
    let pass = $('#model-fix-password .pass').val()
    let new_pass = $('#model-fix-password .new-pass').val()
    let new_pass_conf = $('#model-fix-password .new-pass-conf').val()
    $('#model-fix-password .pass').val('')
    $('#model-fix-password .new-pass').val('')
    $('#model-fix-password .new-pass-conf').val('')
    console.log(pass)
    console.log(new_pass)
    data = {
        password: new_pass,
        password_confirm: pass
    }
    result = "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
    regex = new RegExp(result)
                   
    if (new_pass !== new_pass_conf) {
        alert('Xác nhận mật khẩu chưa chính xác')
    } else if (!new_pass.match(regex)) {
        alert("Mật khẩu bắt buộc có: tối thiểu 8 ký tự, có ít nhất một chữ cái in hoa, một chữ cái in thường, một ký tự đặc biệt")                       
    }
    else {
        var render = new Promise((resolve, reject) => {
            let t = put_data('http://localhost:3000/account', data)
            resolve(t)
        })
        render
            .then(function (t) {
                if (t.message === 'Mật khẩu cũ chưa chính xác') {
                    alert("Mật khẩu cũ chưa chính xác")
                } else {
                    alert('Đã đổi mật khẩu thành công')
                }
            })
    }

    

}

function renderFilter() {
    if (province !== '') {
        $('.filter .city input').val(province)
        $('.filter .city input').attr('disabled', 'disabled')
        if (district !== '') {
            $('.filter .district input').val(district)
            $('.filter .district input').attr('disabled', 'disabled')
            if (ward !== '') {
                $('.filter .ward input').val(ward)
                $('.filter .ward input').attr('disabled', 'disabled')
                if (hamlet !== '') {
                    $('.filter .village input').val(hamlet)
                    $('.filter .village input').attr('disabled', 'disabled')
                }
            }
        }
    }
}

function renderNavbar() {
    if (roles === 'A1' || roles === 'A2' || roles === 'A3') {
        $('.function_statistical_define_citizen').css('display', 'none')
    } else if (roles === 'B1') {
        $('.function_statistical_citizen').css('display', 'none')
    } else {
        $('.function_define_id_acc').css('display', 'none')
        $('.function_statistical_citizen').css('display', 'none')

    }
    $('.function_table_statistical').click(function() {
        if ($('.sub_function').css('display') === 'none') {
            $('.sub_function').css('display', 'block')
        } else {
            $('.sub_function').css('display', 'none')
        }
    })
}


async function post_data(url, data) {
    data = JSON.stringify(data)
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': accToken
        },
        body: data,
    })
    return response.json()
}

async function get_data(url, data) {
    data = JSON.stringify(data)
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': accToken
        }
    })
    return response.json()
}


function filter() {
    $('.filter #btn-search').click(function() {
        console.log('filter')
        var city = $('.filter .city').children('input').val()
        var district = $('.filter .district').children('input').val()
        var village = $('.filter .village').children('input').val()
        var ward = $('.filter .ward').children('input').val()
        if (city === undefined) {
            city = ""
        }
        if (district === undefined) {
            district = ""
        }
        if (village === undefined) {
            village = ""
        }
        if (ward === undefined) {
            ward = ""
        }
        var data = {
            'cityName': city,
            'districtName': district,
            'villageName': village,
            'wardName': ward
        }

        console.log(data)

        //code gửi dữ liệu đi POST
        var render = new Promise((resolve, reject) => {
            let t = post_data("http://localhost:3000/statistical", data)
            resolve(t)
        });
        render
            .then(function(t) {
                console.log(t)
                if (t.message != null) {
                    alert(t.message)
                } else {

                    if (hamlet != "") {
                        text = "Biểu đồ phân bố dân cư theo độ tuổi " + village
                    } else if (ward != "") {
                        text = "Biểu đồ phân bố dân cư theo độ tuổi " + ward
                    } else if (district != "") {
                        text = "Biểu đồ phân bố dân cư theo độ tuổi " + district
                    } else {
                        text = "Biểu đồ phân bố dân cư theo độ tuổi " + city
                    }


                    var b = Object.values(t)
                    let myChart = document.getElementById('myChart').getContext('2d');
                    // Global Options
                    Chart.defaults.global.defaultFontFamily = 'Lato';
                    Chart.defaults.global.defaultFontSize = 18;
                    Chart.defaults.global.defaultFontColor = '#777';

                    let massPopChart = new Chart(myChart, {
                        type: 'bar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
                        data: {
                            labels: ['<=10', '<=20', '<=30', '<=40', '<=50', '<=60', '<=70', '<=80', '<=90', '<=100'],
                            datasets: [{
                                label: 'Population',
                                data: b,
                                //backgroundColor:'green',
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.6)',
                                    'rgba(54, 162, 235, 0.6)',
                                    'rgba(255, 206, 86, 0.6)',
                                    'rgba(75, 192, 192, 0.6)',
                                    'rgba(153, 102, 255, 0.6)',
                                    'rgba(255, 159, 64, 0.6)',
                                    'rgba(255, 99, 132, 0.6)'
                                ],
                                borderWidth: 1,
                                borderColor: '#777',
                                hoverBorderWidth: 3,
                                hoverBorderColor: '#000'
                            }]
                        },
                        options: {
                            title: {
                                display: true,
                                text: text,
                                fontSize: 25
                            },
                            legend: {
                                display: true,
                                position: 'right',
                                labels: {
                                    fontColor: '#000'
                                }
                            },
                            layout: {
                                padding: {
                                    left: 50,
                                    right: 0,
                                    bottom: 0,
                                    top: 0
                                }
                            },
                            tooltips: {
                                enabled: true
                            },
                            responsive: true,
                        }
                    });
                }

            })
    })
}
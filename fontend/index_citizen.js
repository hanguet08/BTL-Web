var username = localStorage.getItem('username')
var roles = localStorage.getItem('roles')
var province = localStorage.getItem('province')
var district = localStorage.getItem('district')
var ward = localStorage.getItem('ward')
var hamlet = localStorage.getItem('hamlet')
var accToken = localStorage.getItem('accToken')
var citizen_id = new Map()

var list_city = new Array()
var list_city_district = new Map()
var list_district_ward = new Map()
var list_ward_village = new Map()


$(document).ready(function() {
    start_2()
})



function start_2() {
    $('.logout p').html(username)

    renderNavbar()
    var render = new Promise((resolve, reject) => {
        let t = get_data("http://localhost:3000/citizens")
        console.log(t)
        console.log(t)
        resolve(t)
    });
    render
        .then(function(t) {
            renderTableInforCitizen(t)
        })
        .then(function() {
            filter()
            renderFilter()
            renderRCM()
         
        })
        .catch(function(error) {
            console.log(error)
            console.log('Lỗi tại start')
        })
}


function logout() {
    ////////////////xóa
    window.localStorage.clear()
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


function renderNavbar() {
    $('.function_table_statistical').click(function() {
        if ($('.sub_function').css('display') === 'none') {
            $('.sub_function').css('display', 'block')
        } else {
            $('.sub_function').css('display', 'none')
        }
    })
}

async function get_data(url) {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': accToken
        }
    })
    return response.json()
}

async function post_data(url, data) {
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

async function delete_data(url, data) {
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': accToken
        },
        body: data,
    })
    return response.json()
}

async function put_data(url, data) {
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': accToken
        },
        body: JSON.stringify(data),
    })
    return response.json()
}

function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
}

function modifydatetime(str) {
    let index = str.indexOf('T')
    return str.slice(0, index)
}

function renderTableInforCitizen(data) {
    console.log('renderTableInforCitizen')
    $('.table-infor-citizen #table-infor-citizen-id tbody').children().remove()
    console.log(data)

    for (var i = 0; i < data.length; i++) {

        // thêm vào map citizen_id để map CCCD đến infor
        var infor_detail = {
            '_id': data[i]._id,
            'name': data[i].name,
            'nativeVillage': data[i].nativeVillage,
            'dateOfBirth': modifydatetime(data[i].dateOfBirth),
            'gender': data[i].gender,
            'address': data[i].address,
            'religion': data[i].religion,
            'job': data[i].job,
            'city': data[i].city.cityName,
            'district': data[i].district.districtName,
            'village': data[i].village.villageName,
            'ward': data[i].ward.wardName,
        }

        let cityName = data[i].city.cityName
        let districtName = data[i].district.districtName
        let wardName = data[i].ward.wardName
        let villageName = data[i].village.villageName

        var tree_loc = new Promise(function(resolve, reject) {
            if (jQuery.inArray(cityName, list_city) === -1) {
                list_city.push(cityName)
                list_city_district.set(cityName, [])
            }
            resolve()
        })
        tree_loc
            .then(function() {
                if (jQuery.inArray(districtName, list_city_district.get(cityName)) === -1) {
                    list_city_district.get(cityName).push(districtName)
                    list_district_ward.set(districtName, [])
                }
            })
            .then(function() {
                if (jQuery.inArray(wardName, list_district_ward.get(districtName)) === -1) {
                    list_district_ward.get(districtName).push(wardName)
                    list_ward_village.set(wardName, [])
                }
            })
            .then(function() {
                if (jQuery.inArray(villageName, list_ward_village.get(wardName)) === -1) {
                    list_ward_village.get(wardName).push(villageName)
                }
            })

        citizen_id.set(data[i].citizenID, infor_detail)
            // console.log("List_city:     " + list_city)
        var temp = `<tr> 
                    <td class="coll-2">${data[i].citizenID}</td>
                    <td class="coll-3">${data[i].name}</td>
                    <td class="coll-4">${data[i].nativeVillage}</td>
                    <td class="coll-5">${modifydatetime(data[i].dateOfBirth)}</td>
                    <td class="coll-6">${data[i].gender}</td>
                    <td class="coll-7">${data[i].address}</td>
                    <td class="coll-8">
                        <button type="button" onclick="watch_detail(this)" class="btn watch" data-toggle="modal" data-target="#watch-info">
                            <i class="fa fa-eye fa-lg" aria-hidden="true" style="color:royalblue"></i>
                        </button>
                    </td>
                </tr>`
        $('.table-infor-citizen #table-infor-citizen-id tbody').append(temp)

    }
    $('#table-infor-citizen-id').DataTable();
    $('.dataTables_length').addClass('bs-select');
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


function renderRCM() {

    $('.filter .city input').change(function() {
        let t = new Promise(function(resolve, reject) {
            $('.rcm_district .recommend_list').children().remove()
            resolve()
        })
        t
            .then(function() {
                let district = list_city_district.get(titleCase($('.city input').val()))
                if (district !== undefined) {
                    for (var i = 0; i < district.length; i++) {
                        var temp = `<div onclick="choice_RCM(this)" class="recommend_item">${district[i]}</div>`
                        $('.rcm_district .recommend_list').append(temp)
                    }
                } else {
                    alert('Không tìm thấy tỉnh/thành phố này')
                }
            })
    })

    $('.filter .district input').change(function() {
        let t1 = new Promise(function(resolve, reject) {
            $('.rcm_ward .recommend_list').children().remove()
            resolve()
        })
        t1
            .then(function() {
                let ward = list_district_ward.get(titleCase($('.district input').val()))

                if (ward !== undefined) {
                    for (var i = 0; i < ward.length; i++) {
                        var temp = `<div onclick="choice_RCM(this)" class="recommend_item">${ward[i]}</div>`
                        $('.rcm_ward .recommend_list').append(temp)
                    }
                } else {
                    alert('Không tìm thấy quận/huyện này.')
                }

            })
    })

    $('.filter .ward input').change(function() {
        let t2 = new Promise(function(resolve, reject) {
            $('.rcm_village .recommend_list').children().remove()
            resolve()
        })
        t2
            .then(function() {
                let village = list_ward_village.get(titleCase($('.ward input').val()))

                if (village !== undefined) {
                    for (var i = 0; i < village.length; i++) {
                        var temp = `<div onclick="choice_RCM(this)" class="recommend_item">${village[i]}</div>`
                        $('.rcm_village .recommend_list').append(temp)
                    }

                } else {
                    alert('Không tìm thấy quận/huyện này.')
                }

            })

        // console.log("list_city_district:   " + list_city_district)
    })
}


function renderClickRCM() {
    if (roles === 'A1') {

        let t4 = new Promise(function(resolve, reject) {
            $('.rcm_city .recommend_list').children().remove()
            resolve()
        })
        t4 
        .then(function(){
            var city = new Set(list_city)
            city = Array.from(city)
            for (var i = 0; i < city.length; i++) {
                var temp = `<div onclick="choice_RCM(this)" class="recommend_item">${city[i]}</div>`
                $('.rcm_city .recommend_list').append(temp)
            }
        })
        


    } else if (roles == 'A2') {
        let t = new Promise(function(resolve, reject) {
            $('.rcm_district .recommend_list').children().remove()
            resolve()
        })
        t
            .then(function() {
                let district = list_city_district.get(titleCase($('.city input').val()))
                for (var i = 0; i < district.length; i++) {
                    var temp = `<div onclick="choice_RCM(this)" class="recommend_item">${district[i]}</div>`
                    $('.rcm_district .recommend_list').append(temp)
                }
            })

    } else if (roles == 'A3') {
        let t1 = new Promise(function(resolve, reject) {
            $('.rcm_ward .recommend_list').children().remove()
            resolve()
        })
        t1
            .then(function() {
                let ward = list_district_ward.get(titleCase($('.district input').val()))
                for (var i = 0; i < ward.length; i++) {
                    var temp = `<div onclick="choice_RCM(this)" class="recommend_item">${ward[i]}</div>`
                    $('.rcm_ward .recommend_list').append(temp)
                }
            })

    } else if (roles == 'B1') {
        let t2 = new Promise(function (resolve, reject) {
            $('.rcm_village .recommend_list').children().remove()
            resolve()
        })
        t2
            .then(function () {
                let village = list_ward_village.get(titleCase($('.ward input').val()))
                console.log(village)
                if (village !== undefined) {
                    for (var i = 0; i < village.length; i++) {
                        var temp = `<div onclick="choice_RCM(this)" class="recommend_item">${village[i]}</div>`
                        $('.rcm_village .recommend_list').append(temp)
                    }
                }
            })

    }
}

function choice_RCM(object) {
    var loc = $(object).html()

    if ($(object).parent().parent().parent().children('input').attr('disabled') !== 'disabled') {
        $(object).parent().parent().parent().children('input').val(loc)
        var type = $(object).parent().parent().parent().children('label').html()
        console.log(type)
        if (type === 'Tỉnh/thành phố') {
            let t = new Promise(function(resolve, reject) {
                $('.rcm_district .recommend_list').children().remove()
                resolve()
            })
            t
                .then(function() {
                    let district = list_city_district.get(titleCase($('.city input').val()))
                    for (var i = 0; i < district.length; i++) {
                        var temp = `<div onclick="choice_RCM(this)" class="recommend_item">${district[i]}</div>`
                        $('.rcm_district .recommend_list').append(temp)
                    }
                })

        } else if (type === "Quận/huyện") {
            let t1 = new Promise(function(resolve, reject) {
                $('.rcm_ward .recommend_list').children().remove()
                resolve()
            })
            t1
                .then(function() {
                    let ward = list_district_ward.get(titleCase($('.district input').val()))
                    for (var i = 0; i < ward.length; i++) {
                        var temp = `<div onclick="choice_RCM(this)" class="recommend_item">${ward[i]}</div>`
                        $('.rcm_ward .recommend_list').append(temp)
                    }
                })
        } else if (type === "Xã/phường") {
            let t2 = new Promise(function(resolve, reject) {
                $('.rcm_village .recommend_list').children().remove()
                resolve()
            })
            t2
                .then(function() {
                    let village = list_ward_village.get(titleCase($('.ward input').val()))
                    for (var i = 0; i < village.length; i++) {
                        var temp = `<div onclick="choice_RCM(this)" class="recommend_item">${village[i]}</div>`
                        $('.rcm_village .recommend_list').append(temp)
                    }
                })
        }
    }
}

function filter() {
    $('.filter #btn-search').click(function() {
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
        data = JSON.stringify(data)

        //code gửi dữ liệu đi POST

        var render = new Promise((resolve, reject) => {
            let t = post_data("http://localhost:3000/search", data)
            resolve(t)
        });
        render
            .then(function(t) {
                console.log(t)
                renderTableInforCitizen(t)
            })
    })
}

function watch_detail(object) {
    console.log('watch_detail')
    console.log(citizen_id)
    var citizen_key = $(object).parent().parent().children('.coll-2').html()
    $('.watch-info .citizenID').children('input').val(citizen_key)
    $('.watch-info .name').children('input').val(citizen_id.get(citizen_key).name)
    $('.watch-info .nativeVillage').children('input').val(citizen_id.get(citizen_key).nativeVillage)
    $('.watch-info .dateOfBirth').children('input').val(citizen_id.get(citizen_key).dateOfBirth)
    $('.watch-info .gender').children('input').val(citizen_id.get(citizen_key).gender)
    $('.watch-info .address').children('input').val(citizen_id.get(citizen_key).address)
    $('.watch-info .religion').children('input').val(citizen_id.get(citizen_key).religion)
    $('.watch-info .job').children('input').val(citizen_id.get(citizen_key).job)
    $('.watch-info .cityName').children('input').val(citizen_id.get(citizen_key).city)
    $('.watch-info .districtName').children('input').val(citizen_id.get(citizen_key).district)
    $('.watch-info .wardName').children('input').val(citizen_id.get(citizen_key).ward)
    $('.watch-info .villageName').children('input').val(citizen_id.get(citizen_key).village)
}
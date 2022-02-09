var username = localStorage.getItem('username')
var roles = localStorage.getItem('roles')
var province = localStorage.getItem('province')
var district = localStorage.getItem('district')
var ward = localStorage.getItem('ward')
var hamlet = localStorage.getItem('hamlet')
var accToken = localStorage.getItem('accToken')
var active = localStorage.getItem('active')

var complete = localStorage.getItem('complete')
console.log(complete)

var delete_id = ''

var citizen_id = new Map()


var list_city = new Array()
var list_city_district = new Map()
var list_district_ward = new Map()
const list_ward_village = new Map()

$(document).ready(function() {
    start()
    render_done()
})


function start() {

    $('.logout p').html(username)


    renderNavbar()
    var render = new Promise((resolve, reject) => {
        let t = get_data("http://localhost:3000/citizens")
        console.log(t)
        resolve(t)
    });
    render
        .then(function(t) {
            renderTableInforCitizen(t)
            console.log("hello")
        })
        .then(function() {
           
            filter()
            renderFilter()
            done()
            render_done()
            renderRCM()

        })
        .catch(function(error) {
            console.log(error)
            console.log('Lỗi tại start')
        })
}


/////////////////////////////////////////////////////////////////////////////////


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

    if (roles !== 'B1') {
        $('.function_define_id_acc').css('display', 'none')
        $('.statistical_location').css('display', 'none')
    }

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

async function delete_data(url, data) {
    data = JSON.stringify(data)
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
    data = JSON.stringify(data)
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': accToken
        },
        body: data
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

function modifydatetime1(str) {
    let index = str.indexOf('T')
    return str.slice(0, index)
}

function modifydatetime2(str) {
    let index = str.indexOf('.')
    return str.slice(0, index)
}

function renderTableInforCitizen(data) {
    console.log('renderTableInforCitizen')
    $('.table-infor-citizen #table-infor-citizen-id tbody').children().remove()

    for (var i = 0; i < data.length; i++) {

        // thêm vào map citizen_id để map CCCD đến infor
        var infor_detail = {
            '_id': data[i]._id,
            'name': data[i].name,
            'nativeVillage': data[i].nativeVillage,
            'dateOfBirth': modifydatetime1(data[i].dateOfBirth),
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

        var temp = `<tr>
                    <td class="coll-2">${data[i].citizenID}</td>
                    <td class="coll-3">${data[i].name}</td>
                    <td class="coll-4">${data[i].nativeVillage}</td>
                    <td class="coll-5">${modifydatetime1(data[i].dateOfBirth)}</td>
                    <td class="coll-6">${data[i].gender}</td>
                    <td class="coll-7">${data[i].address}</td>
                    <td class="coll-8">
                        <button type="button" onclick="watch_detail(this)" class="btn watch" data-toggle="modal" data-target="#watch-info">
                            <i class="fa fa-eye fa-lg" aria-hidden="true" style="color:royalblue"></i>
                        </button>
                    </td>
                    <td class="coll-9">
                        <button type="button" onclick="reask_delete_citizen(this)" class="btn delete-citizen" data-toggle="modal" data-target="#delete-infor-modal">
                            <i class="fa fa-trash fa-lg" aria-hidden="true" style="color:red"></i>
                        </button>
                    </td>
                    <td class="coll-10"> 
                        <button type="button" onclick="renderForFixCitizen(this)" class="btn fix-info" data-toggle="modal" data-target="#model-fix-acc-citizen">
                            <i class="fa fa-pencil fa-lg" aria-hidden="true" style="color:black"></i>
                        </button>
                    </td>
                </tr>`
        $('.table-infor-citizen #table-infor-citizen-id tbody').append(temp)

    }
    $('#table-infor-citizen-id').DataTable();
    $('.dataTables_length').addClass('bs-select');

}

/////////////////////////////////////////////////////////////////////////////////
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

function render_click_done(object) {
    console.log('Done')
    if ($(object).css('background-color') === 'rgb(0, 128, 0)') {
        $(object).css('background-color', '#a1acdb')
        $(object).css('color', 'black')
    } else {
        $(object).css('background-color', 'green')
        $(object).css('color', 'white')
    }
}

function render_done() {
    console.log(complete)
    if (complete === '1') {
        $('.done').css('background-color', 'green')
    }
    if (roles === 'B2') {
        $('.done').css('display', 'none')
        
    }
}

function renderForFixCitizen(object) {
    console.log('renderForFixCitizen')
    var CCCD = $(object).parent().parent().children(".coll-2").html()
    console.log(CCCD + "           " + citizen_id.get(CCCD))
    var name = citizen_id.get(CCCD).name
    var nativeVillage = citizen_id.get(CCCD).nativeVillage
    var dateOfBirth = citizen_id.get(CCCD).dateOfBirth
    var gender = citizen_id.get(CCCD).gender
    var address = citizen_id.get(CCCD).address
    var religion = citizen_id.get(CCCD).religion
    var job = citizen_id.get(CCCD).job
    var villageName = citizen_id.get(CCCD).village

    $('.model-fix-acc-citizen .citizenID input').val(CCCD)
    $('.model-fix-acc-citizen .name input').val(name)
    $('.model-fix-acc-citizen .nativeVillage input').val(nativeVillage)
    $('.model-fix-acc-citizen .dateOfBirth input').val(dateOfBirth)
    $('.model-fix-acc-citizen .gender input').val(gender)
    $('.model-fix-acc-citizen .address input').val(address)
    $('.model-fix-acc-citizen .religion input').val(religion)
    $('.model-fix-acc-citizen .job input').val(job)
    $('.model-fix-acc-citizen .villageName input').val(villageName)

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
        var city = new Set(list_city)
        city = Array.from(city)
        for (var i = 0; i < city.length; i++) {
            var temp = `<div onclick="choice_RCM(this)" class="recommend_item">${city[i]}</div>`
            $('.rcm_city .recommend_list').append(temp)
        }


    } else if (roles == 'A2') {
        let district = list_city_district.get(titleCase($('.city input').val()))
        if (district !== undefined) {
            for (var i = 0; i < district.length; i++) {
                var temp = `<div onclick="choice_RCM(this)" class="recommend_item">${district[i]}</div>`
                $('.rcm_district .recommend_list').append(temp)
            }
        }

    } else if (roles == 'A3') {
        let ward = list_district_ward.get(titleCase($('.district input').val()))

        if (ward !== undefined) {
            for (var i = 0; i < ward.length; i++) {
                var temp = `<div onclick="choice_RCM(this)" class="recommend_item">${ward[i]}</div>`
                $('.rcm_ward .recommend_list').append(temp)
            }
        }

    } else if (roles == 'B1') {
        let t2 = new Promise(function(resolve, reject) {
            $('.rcm_village .recommend_list').children().remove()
            resolve()
        })
        t2
            .then(function() {
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

function watch_detail(object) {
    console.log('watch_detail')
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

function reask_delete_citizen(object) {
    console.log('delete_citizen')
    delete_id = $(object).parent().parent().children('.coll-2').html()
    console.log(delete_id)
    $('#delete-infor-modal p').html('Bạn có muốn xóa công dân ' + delete_id + ' không.')
}

//////////////////////////////////////////////////////////////////////////////

function done() {
    $('.done').click(function() {
        var data = ''
        if ($(this).css('background-color') === 'rgb(0, 128, 0)') {
            complete = '0'
            data = { completeTheWork: 0 }
        } else {
            complete = '1'
            data = { completeTheWork: 1 }
        }

        var done = new Promise((resolve, reject) => {

            var temp = post_data("http://localhost:3000/completeTheWork", data)
            resolve(temp)
        });
        done
            .then(function(temp) {
                
                localStorage.set('complete', complete)
                console.log(temp)
            })
            .catch(function() {
                console.log('Lỗi done')
            })
    })

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

function render_create() {
    console.log(roles)
    if (roles === 'B2') {
        $('.hello .village').children('input').val(hamlet)
        $('.hello .village').children('input').attr('disabled', 'disabled')
    }
}

function create_citizen(object) {
    console.log('create_citizen')
    if (complete === '0') {
        if (active === '1') {
        var CCCD = $(object).parent().children('.citizenID').children('input').val()
        var name = $(object).parent().children('.name').children('input').val()
        var nativeVillage = $(object).parent().children('.nativeVillage').children('input').val()
        var dateOfBirth = $(object).parent().children('.dateOfBirth').children('input').val()
        var gender = $(object).parent().children('.gender').children('input').val()
        var address = $(object).parent().children('.address').children('input').val()
        var religion = $(object).parent().children('.religion').children('input').val()
        var job = $(object).parent().children('.job').children('input').val()
        var villageName = $(object).parent().children('.village').children('input').val()

        var list_CCCD = $('#table-infor-citizen-id tbody .coll-2').map(function() {
            return $(this).html()
        })

        if (jQuery.inArray(CCCD, list_CCCD) !== -1) {
            alert('Số căn cước công dân này đã tồn tại')
        } else {
            if (CCCD === '' || name === '' || nativeVillage === '' || dateOfBirth === '' ||
                gender === '' || address === '' || religion === '' || job === '' || villageName === '') {
                alert('Bạn chưa điền đủ thông tin')
            } else {
                console.log(CCCD)
                $(object).parent().children('.citizenID').children('input').val('')
                $(object).parent().children('.name').children('input').val('')
                $(object).parent().children('.nativeVillage').children('input').val('')
                $(object).parent().children('.dateOfBirth').children('input').val('')
                $(object).parent().children('.gender').children('input').val('')
                $(object).parent().children('.address').children('input').val('')
                $(object).parent().children('.religion').children('input').val('')
                $(object).parent().children('.job').children('input').val('')
                $(object).parent().children('.village').children('input').val('')
                    //code post data lên và vẽ lại bảng

                var data = {
                    'citizenID': CCCD,
                    'name': name,
                    'nativeVillage': nativeVillage,
                    'dateOfBirth': dateOfBirth,
                    'gender': gender,
                    'address': address,
                    'religion': religion,
                    'job': job,
                    'villageName': villageName
                }


                console.log(data)

                var render = new Promise((resolve, reject) => {
                    if (roles == "B1") {
                        url = "http://localhost:3000/citizenB1"
                    }
                    if (roles == "B2") {
                        url = "http://localhost:3000/citizenB2"
                    }
                    let new_ctz = post_data(url, data)
                    resolve(new_ctz)
                });
                render
                    .then(function(new_ctz) {
                        var infor = {
                            '_id': new_ctz._id,
                            'name': new_ctz.name,
                            'nativeVillage': new_ctz.nativeVillage,
                            'dateOfBirth': modifydatetime1(new_ctz.dateOfBirth),
                            'gender': new_ctz.gender,
                            'address': new_ctz.address,
                            'religion': new_ctz.religion,
                            'job': new_ctz.job,
                            'city': new_ctz.city.cityName,
                            'district': new_ctz.district.districtName,
                            'village': new_ctz.village.villageName,
                            'ward': new_ctz.ward.wardName,
                        }
                        citizen_id.set(CCCD, infor)
                    })
                    .then(function() {
                        var table = $('#table-infor-citizen-id').DataTable();
                        var citizen = $(`
                        <tr>
                            <td class="coll-2">${CCCD}</td>
                            <td class="coll-3">${citizen_id.get(CCCD).name}</td>
                            <td class="coll-4">${citizen_id.get(CCCD).nativeVillage} </td>
                            <td class="coll-5">${citizen_id.get(CCCD).dateOfBirth}</td>
                            <td class="coll-6">${citizen_id.get(CCCD).gender}</td>
                            <td class="coll-7">${citizen_id.get(CCCD).address}</td>
                            <td class="coll-8">
                                <button type="button" class="btn watch" data-toggle="modal" data-target="#watch-info">
                                    <i class="fa fa-eye fa-lg" aria-hidden="true" style="color:royalblue"></i>
                                </button>
                            </td>
                            <td class="coll-9">
                                <button type="button" class="btn btn-link" data-toggle="modal" data-target="#delete-infor-modal">
                                    <i class="fa fa-trash fa-lg" aria-hidden="true" style="color:red"></i>
                                </button>
                            </td>
                            <td class="coll-10">
                                <button type="button" class="btn fix-info" data-toggle="modal" data-target="#model-fix-acc-citizen">
                                    <i class="fa fa-pencil fa-lg" aria-hidden="true" style="color:black"></i>
                                </button></td>
                            </tr>`)
                        table.row.add(citizen[0]).draw();

                        console.log("citizen_id:     " + citizen_id)
                    })
                    .catch(function() {
                        console.log('Lỗi tại hàm create_citizen')
                    })
            }
        }

    } else {
        alert('Bạn đã hết thời gian hoạt động')
    }
    } else {
        alert('Bạn đã hoàn thành khai báo. Không thể tiếp tục khai báo')
    }
    
}

function delete_citizen() {
    if(complete === '0') {
        if (active === '1') {
        console.log('delete_citizen')
        var data = {
            'citizenID': delete_id
        }

        citizen_id.delete(delete_id)

        console.log("delete_id " + delete_id)
        console.log("data " + data)


        var render = new Promise((resolve, reject) => {
            delete_data("http://localhost:3000/citizen", data)
            resolve()
        });
        render
            .then(function() {

                var row = $("#table-infor-citizen-id tbody tr")
                var found = ''

                for (var i = 0; i < row.length; i++) {
                    if ($(row[i]).children('.coll-2').html() === delete_id) {
                        found = row[i];
                        break;
                    }
                }

                var table = $('#table-infor-citizen-id').DataTable();
                table
                    .row($(found))
                    .remove()
                    .draw();
            })
            .catch(function(error) {
                console.log('Lỗi tại hàm delete_citizen')
                console.log(error)
            })
    } else {
        alert('Bạn đã hết thời gian hoạt động')
    }
    } else {
        alert('Bạn đã hoàn thành khai báo. Không thể khai báo tiếp.')
    }
    

}

function fix_infor_citizen(object) {
    if (complete === '0') {
        if (active === '1') {
        console.log('fix_infor_citizen')
        var CCCD = $(object).parent().children('.citizenID').children('input').val()
        var new_CCCD = $(object).parent().children('.new-citizenID').children('input').val()
        var new_name = $(object).parent().children('.new-name').children('input').val()
        var new_nativeVillage = $(object).parent().children('.new-nativeVillage').children('input').val()
        var new_dateOfBirth = $(object).parent().children('.new-dateOfBirth').children('input').val()
        var new_gender = $(object).parent().children('.new-gender').children('input').val()
        var new_address = $(object).parent().children('.new-address').children('input').val()
        var new_religion = $(object).parent().children('.new-religion').children('input').val()
        var new_job = $(object).parent().children('.new-job').children('input').val()
        var new_villageName = $(object).parent().children('.new-villageName').children('input').val()

        var list_CCCD = $('#table-infor-citizen-id tbody .coll-2').map(function() {
            return $(this).html()
        })

        if (jQuery.inArray(new_CCCD, list_CCCD) !== -1) {
            alert('Số căn cước công dân này đã tồn tại')
        } else {
            //code gửi data đi và render lại bảng
            $(object).parent().children('.new-citizenID').children('input').val('')
            $(object).parent().children('.new-name').children('input').val('')
            $(object).parent().children('.new-nativeVillage').children('input').val('')
            $(object).parent().children('.new-dateOfBirth').children('input').val('')
            $(object).parent().children('.new-gender').children('input').val('')
            $(object).parent().children('.new-address').children('input').val('')
            $(object).parent().children('.new-religion').children('input').val('')
            $(object).parent().children('.new-job').children('input').val('')
            $(object).parent().children('.new-villageName').children('input').val('')


            var data = {
                '_id': citizen_id.get(CCCD)._id,
                'citizenID': new_CCCD,
                'name': new_name,
                'nativeVillage': new_nativeVillage,
                'dob': new_dateOfBirth,
                'gender': new_gender,
                'address': new_address,
                'religion': new_religion,
                'job': new_job,
                'villageName': new_villageName
            }

            var render = new Promise((resolve, reject) => {
                // thêm url---------------------
                var new_infor = put_data("http://localhost:3000/citizen", data)
                resolve(new_infor)
            });
            render
                .then(function(new_infor) {
                    if (new_CCCD === '') {
                        new_CCCD = CCCD
                    }
                    var infor = {
                        '_id': new_infor._id,
                        'name': new_infor.name,
                        'nativeVillage': new_infor.nativeVillage,
                        'dateOfBirth': modifydatetime1(new_infor.dateOfBirth),
                        'gender': new_infor.gender,
                        'address': new_infor.address,
                        'religion': new_infor.religion,
                        'job': new_infor.job,
                        'city': new_infor.city.cityName,
                        'district': new_infor.district.districtName,
                        'village': new_infor.village.villageName,
                        'ward': new_infor.ward.wardName,
                    }

                    citizen_id.delete(CCCD)
                    console.log("infor        " + infor)
                    citizen_id.set(new_CCCD, infor)
                    console.log("CCCD_new    " + citizen_id.get(new_CCCD))

                })
                .then(function() {
                    var row = $("#table-infor-citizen-id tbody tr")
                    var found;
                    for (var i = 0; i < row.length; i++) {
                        if ($(row[i]).children('.coll-2').html() === CCCD) {
                            found = row[i];
                            break;
                        }
                    }
                    var table = $('#table-infor-citizen-id').DataTable();
                    table
                        .row($(found))
                        .remove()
                        .draw();

                    var citizen = $(`
                    <tr>
                        <td class="coll-2">${new_CCCD}</td>
                        <td class="coll-3">${citizen_id.get(new_CCCD).name}</td>
                        <td class="coll-4">${citizen_id.get(new_CCCD).nativeVillage} </td>
                        <td class="coll-5">${citizen_id.get(new_CCCD).dateOfBirth}</td>
                        <td class="coll-6">${citizen_id.get(new_CCCD).gender}</td>
                        <td class="coll-7">${citizen_id.get(new_CCCD).address}</td>
                        <td class="coll-8">
                            <button type="button" class="btn watch" data-toggle="modal" data-target="#watch-info">
                                <i class="fa fa-eye fa-lg" aria-hidden="true" style="color:royalblue"></i>
                            </button>
                        </td>
                        <td class="coll-9">
                            <button type="button" class="btn btn-link" data-toggle="modal" data-target="#delete-infor-modal">
                                <i class="fa fa-trash fa-lg" aria-hidden="true" style="color:red"></i>
                            </button>
                        </td>
                        <td class="coll-10">
                            <button type="button" class="btn fix-info" data-toggle="modal" data-target="#model-fix-acc-citizen">
                                <i class="fa fa-pencil fa-lg" aria-hidden="true" style="color:black"></i>
                            </button>
                        </td>
                    </tr>`)
                    table.row.add(citizen[0]).draw();
                })
                .catch(function() {
                    console.log('Lỗi ở fix_infor_cititzen')
                })

        }
    } else {
        alert('Bạn đã hết thời gian hoạt động')
    }
    } else {
        alert('Bạn đã hoàn thành khai báo. Không thể khai báo.')
    }
    

}


var username = localStorage.getItem('username')
var roles = localStorage.getItem('roles')
var province = localStorage.getItem('province')
var district = localStorage.getItem('district')
var ward = localStorage.getItem('ward')
var hamlet = localStorage.getItem('hamlet')
var accToken = localStorage.getItem('accToken')
var active = localStorage.getItem('active')

var complete = localStorage.getItem('compalete')

var delete_id = ''

var loc_id = new Map()

$(document).ready(function() {
    start_1()
})

function start_1() {
    $('.logout p').html(username)
    
    
    renderNavbar()
    renderStartDefine()
    var render = new Promise((resolve, reject) => {
        let t = get_data("http://localhost:3000/account")
        console.log(t)
        resolve(t)
    });
    render
        .then(function(t) {
            renderTableInforAcc(t)

        })
        .then(function() {
            def_id_loc()
            def_acc()
            fixInforAcc()
        })
        .catch(function(error) {
            console.log(error)
            console.log('Lỗi tại start')
        })
}

///////////////////////////////////////////

function logout() {
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
    if (roles === 'B1') {
        $('.function_statistical_citizen').css('display', 'none')
    } else {
        $('.function_statistical_define_citizen').css('display', 'none')
    }
    $('.function_table_statistical').click(function() {
        if ($('.sub_function').css('display') === 'none') {
            $('.sub_function').css('display', 'block')
        } else {
            $('.sub_function').css('display', 'none')
        }
    })
}

function renderStartDefine() {
    console.log('renderStartDenfine')
    var loc = ''
    if (roles === 'A1') {
        loc = 'Tỉnh/Thành phố'
    } else if (roles === 'A2') {
        loc = 'Huyện/Quận'
    } else if (roles === 'A3') {
        loc = 'Xã/Phường'
    } else if (roles === 'B1') {
        loc = 'Xóm'
    }
    $('.def-id-loc .label-loc-dil').html(loc + ':')
    $('.def-acc .label-loc-dacc').html(loc + ':')
    $('.table-infor thead .coll-2').html(loc)
    $('.table-infor tfoot .coll-2').html(loc)

}

function renderForFixAcc(object) {
    console.log('renderForFixAcc')
    var code = $(object).parent().parent().children(".coll-1").html()
    var name_loc = $(object).parent().parent().children(".coll-2").html()
    var username = $(object).parent().parent().children(".coll-3").html()

    $('.model-fix-acc .loc input').val(name_loc)
    $('.model-fix-acc .code input').val(code)
    $('.model-fix-acc .username input').val(username)
    
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
    console.log(accToken)
    return response.json()
}

async function delete_data(url, data) {
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': accToken
        },
        body: JSON.stringify(data),
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
        //body: JSON.stringify(data),
        body: data,
    })
    return response.json()
}

function render_reask_delete(object) {
    delete_id = $(object).parent().parent().children('.coll-1').html()
}

function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
}

function modifydatetime(str) {
    let index = str.indexOf('.')
    return str.slice(0, index)
}

/////////////////////////////////////////////////
function renderTableInforAcc(data_full) {
    var data = data_full.account
    var data_loc_id = data_full.location
    console.log(data)

    for (var i = 0; i < data.length; i++) {
        var loc = ''
        if (roles === 'A1') {
            loc = data[i].city.cityName
            loc_id.set(loc, data[i].city._id)
        } else if (roles === 'A2') {
            loc = data[i].district.districtName
            loc_id.set(loc, data[i].district._id)

        } else if (roles === 'A3') {
            loc = data[i].ward.wardName
            loc_id.set(loc, data[i].ward._id)

        } else if (roles === 'B1') {
            loc = data[i].village.villageName
            loc_id.set(loc, data[i].village._id)
        }

        var timeS = modifydatetime(data[i].timeStart)
        var timeF = modifydatetime(data[i].timeFinish)
        var complete = ""

        if (roles === 'B1') {
            complete = ''
        } else {
            if (data[i].complete === 0) {
                complete = "Chưa hoàn thành <i class='fa fa-times complete-0' aria-hidden='true'></i>"
            } else {
                complete = "Hoàn thành <i class='fa fa-check complete-1' aria-hidden='true'></i>"
            }
        }

        
        var temp = `<tr>
                    <td class="coll-0"><input type="checkbox"></td>
                    <td class="coll-1">${data[i].username}</td>
                    <td class="coll-2">${loc}</td>
                    <td class="coll-3">${data[i].username}</td>
                    <td class="coll-4">
                    <label for="from" class="from-label">Từ: </label>
                    <input type="text" class="from" id="from" disabled='disabled' value=${timeS} >
                    <br>
                    <label for="to" class="to-label">Đến: </label>
                    <input type="text" class="to" id="to" disabled='disabled' value=${timeF}>
                    </td>
                    <td class="coll-7">${complete}</td>
                    <td class="coll-6">
                        <button type="button" onclick="renderForFixAcc(this)" class="btn fix-info" data-toggle="modal" data-target="#model-fix-acc">
                            <i class="fa fa-pencil" aria-hidden="true"></i>
                        </button>
                    </td>
                    <td class="coll-8">
                        <button type="button" onclick="render_reask_delete(this)" class="btn delete-info" data-toggle="modal" data-target="#delete-acc-modal">
                            <i class="fa fa-trash" aria-hidden="true"></i>
                        </button>
                    </td>
                </tr>`
        $('.table-infor #table-infor-acc tbody').append(temp)

    }

    for (var i = 0; i < data_loc_id.length; i++) {
        var loc = ''
        var code = ''
        if (roles === 'A1') {
            loc = data_loc_id[i].cityName
            code = data_loc_id[i].cityID
            loc_id.set(loc, data_loc_id[i]._id)
        } else if (roles === 'A2') {
            loc = data_loc_id[i].districtName
            code = data_loc_id[i].districtID
            loc_id.set(loc, data_loc_id[i]._id)

        } else if (roles === 'A3') {
            loc = data_loc_id[i].wardName
            code = data_loc_id[i].wardID
            loc_id.set(loc, data_loc_id[i]._id)

        } else if (roles === 'B1') {
            loc = data_loc_id[i].villageName
            code = data_loc_id[i].villageID
            loc_id.set(loc, data_loc_id[i]._id)
        }
        console.log("Loc:  " + data_loc_id[i])
        var temp =
            `<tr>
            <td class="coll-0"><input type="checkbox"></td>
            <td class="coll-1">${code}</td>
            <td class="coll-2">${loc}</td>
            <td class="coll-3">Chưa cấp</td>
            <td class="coll-4">
            <label for="from" class="from-label">Từ: </label>
            <input type="datetime-local" class="from" id="from" disabled='disabled'>
            <br>
            <label for="to" class="to-label">Đến: </label>
            <input type="datetime-local" class="to" id="to" disabled='disabled'>
            </td>
            <td class="coll-7"></td>
            <td class="coll-6">
                <button type="button" onclick="renderForFixAcc(this)" class="btn fix-info" data-toggle="modal" data-target="#model-fix-acc">
                        <i class="fa fa-pencil" aria-hidden="true"></i>
                </button>
            </td>
            <td class="coll-8">
                <button type="button" onclick="render_reask_delete(this)" class="btn delete-info" data-toggle="modal" data-target="#delete-acc-modal">
                    <i class="fa fa-trash" aria-hidden="true"></i>
                </button>
            </td>
        </tr>`
        $('.table-infor #table-infor-acc tbody').append(temp)
    }

    $('#table-infor-acc').DataTable();
    $('.dataTables_length').addClass('bs-select');

}

////////////////////////////////////////////////

function fixInforAcc() {
    $('.model-fix-acc .modal-body .btn').click(function() {
        console.log('fixInforAcc')
        if (active === '1') {
            var type_loc = ""
            if (roles === "A1") {
                type_loc = 'tỉnh/thành phố'
            } else if (roles === "A2") {
                type_loc = 'quận/huyện'
            } else if (roles === "A3") {
                type_loc = 'xã/phường'
            }
            var loc = $('.model-fix-acc .loc input').val()
            var new_loc = titleCase($('.model-fix-acc .new-loc input').val()) 
            $('.model-fix-acc .new-loc input').val('')
            var code = $('.model-fix-acc .code input').val()
            var new_code = $('.model-fix-acc .new-code input').val()
            $('.model-fix-acc .new-code input').val('')
            var user = $('.model-fix-acc .username input').val()
            var new_username = $('.model-fix-acc .new-username input').val()
            $('.model-fix-acc .new-username input').val('')

            var pass = $('.model-fix-acc .pass input').val()
            $('.model-fix-acc .pass input').val('')
            var new_pass = $('.model-fix-acc .new-pass input').val()
            $('.model-fix-acc .new-pass input').val('')

            var timeStart = $('.model-fix-acc .from').val()
            $('.model-fix-acc .from').val('')
            var timeFinish = $('.model-fix-acc .to').val()
            $('.model-fix-acc .to').val('')

            var update = ''
            var list_username = $('.table-infor tbody .coll-1').map(function() {
                if ($(this).html() === code) {
                    update = $(this).parent()
                }
                return $(this).html()
            })
            var list_loc = $('.table-infor tbody .coll-2').map(function() {
                return $(this).html()
            })

            var check = new Promise(function(resolve, reject) {
                if (user === 'Chưa cấp' && new_username !== '') {
                    alert(loc + ' chưa được cấp tài khoản')
                    resolve(false)
                } else {
                    resolve(true)
                }
            })

            check
                .then(function(check) {
                    if (check) {
                        if ((new_username !== new_code && new_username.length > 0 && new_code.length > 0)) {
                            alert('Mã mới và tên đăng nhập mới không trùng khớp')
                            return false
                        } else {
                            return true
                        }
                    } else {
                        return false
                    }
                })
                .then(function(check) {
                    if (check) {
                        if (jQuery.inArray(new_code, list_username) !== -1 || jQuery.inArray(new_username, list_username) !== -1 || jQuery.inArray(new_loc.toLowerCase(), list_loc) !== -1) {
                            alert('Mã hoặc tên địa danh hoặc tên đăng nhập này đã tồn tại')
                            return false
                        } else {
                            return true
                        }
                    } else {
                        return false
                    }
                })
                .then(function(check) {
                    if (check) {
                        if (new_code.length > 0 && new_username.length === 0) {
                            new_username = new_code
                        } else if (new_code.length === 0 && new_username.length > 0) {
                            new_code = new_username
                        }

                        if (type_loc === 'tỉnh/thành phố' && new_code.length > 0 && (String(Number(new_code)) === 'NaN' || Number(new_code) < 1 || Number(new_code) > 63 || new_code.length !== 2)) {
                            alert('Mã phải là số gồm hai chữ số trong khoảng 01 đến 63')
                            return false

                        } else if (type_loc === 'quận/huyện' && new_code.length > 0 && (String(Number(new_code)) === 'NaN' || new_code.length !== 4 || Number(new_code.substring(0, 2)) !== Number(username))) {
                            alert('Mã phải là số gồm 4 chữ số với 2 chữ số đầu trùng với mã tỉnh/thành phố của bạn')
                            return false

                        } else if (type_loc === 'xã/phường' && new_code.length > 0 && (String(Number(new_code)) === 'NaN' || new_code.length !== 6 || Number(new_code.substring(0, 4)) !== Number(username))) {
                            alert('Mã phải là số gồm 6 chữ số với 4 chữ số đầu trùng với mã quận/huyện của bạn')
                            return false

                        } else {
                            return true
                        }
                    } else {
                        return false
                    }
                })
                .then(function(check) {
                    if (check) {
                        result = "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
                        regex = new RegExp(result)
                        if (new_pass != "") {
                            if (new_pass.match(regex)) {
                                return true;
                            } else {
                                alert("Mật khẩu bắt buộc có: tối thiểu 8 ký tự, có ít nhất một chữ cái in hoa, một chữ cái in thường, một ký tự đặc biệt")
                                return false
                            }
                        } else {
                            return true;
                        }
                    } else {
                        return false
                    }
                })
                .then(function(check) {
                    if (check) {
                        var _id = loc_id.get(loc)
                        var data = {
                            _id: _id,
                            cityID: new_code,
                            cityName: new_loc,

                            districtID: new_code,
                            districtName: new_loc,

                            wardID: new_code,
                            wardName: new_loc,

                            villageID: new_code,
                            village: new_loc,

                            password_confirm: pass,
                            password: new_pass,
                            timeStart: timeStart,
                            timeFinish: timeFinish
                        }

                        console.log("Fixinfordata        " + data)
                        var render = new Promise((resolve, reject) => {
                            if (roles === "A1") {
                                url = "http://localhost:3000/city"
                            }
                            if (roles === "A2") {
                                url = "http://localhost:3000/district"
                            }
                            if (roles === "A3") {
                                url = "http://localhost:3000/ward"
                            }
                            if (roles === "B1") {
                                url = "http://localhost:3000/village"

                            }
                            let t = put_data(url, data)

                            resolve(t)
                        })
                        render
                            .then(function (t) {
                                if (t.message !== 'Chỉnh sửa thành công') {
                                    alert(t.message)
                                    return false
                                } else {
                                    
                                    return true
                                }
                            })
                            .then(function (check) {
                                if (check) {
                                    loc_id.delete(loc)
                                    loc_id.set(new_loc, _id)
                                    return true
                                } else {
                                    return false
                                }

                            })
                            .then(function (check) {
                                ////////////////////////////////////////////////Sửa
                                if (check) {
                                    var new_row = update
                                
                                    if (new_loc.length !== 0) {
                                        $(new_row).children('.coll-2').html(new_loc)
                                    }

                                    if (new_username.length !== 0) {
                                        $(new_row).children('.coll-3').html(new_username)
                                    }

                                    if (new_code.length !== 0) {
                                        $(new_row).children('.coll-1').html(new_code)
                                    }

                                    if (timeStart !== '') {
                                        $(new_row).children('.coll-4').children('.from').val(modifydatetime(timeStart))
                                    }

                                    if (timeFinish !== '') {
                                        $(new_row).children('.coll-4').children('.to').val(modifydatetime(timeFinish))
                                    }
                                    var table = $('#table-infor-acc').DataTable();
                                    table
                                        .row($(update))
                                        .remove()
                                        .draw();
                                    table.row.add(new_row).draw();

                                    alert('Đã chỉnh sửa thành công')
                                }
                                
                            })
                            .catch(function() {
                                console.log("Lỗi tại hàm fixInforAcc")
                            })
                    }
                })
                .catch(function() {
                    console.log("Lỗi tại hàm fixInforAcc")
                })
        } else {
            alert('Bạn đã hết thời gian hoạt động')
        }

    })
}

function def_id_loc() {
    $('.def-id-loc .btn').click(function() {
        console.log('def_id_loc')
        if (active === '1') {
            var loc = $(this).parent().children('.loc').val().toLowerCase()
            var code = $(this).parent().children('.id').val()

            /////////////////////////
            $(this).parent().children('.loc').val('')
            $(this).parent().children('.id').val('')

            var type_loc = ""

            if (roles === "A1") {
                type_loc = 'tỉnh/thành phố'
            } else if (roles === "A2") {
                type_loc = 'quận/huyện'
            } else if (roles === "A3") {
                type_loc = 'xã/phường'
            }

            var codes_th = $('.table-infor tbody .coll-1').map(function() {
                return $(this).html()
            })
            var locs_th = $('.table-infor tbody .coll-2').map(function() {
                return $(this).html().toLowerCase()
            })

            var check = new Promise(function(resolve, reject) {
                if (loc === "") {
                    alert('Bạn chưa điền ' + type_loc)
                    resolve(false)
                } else {
                    resolve(true)
                }
            })

            check
                .then(function(check) {
                    if (check) {
                        if (code === "") {
                            alert('Bạn chưa điền mã')
                            return false
                        } else {
                            return true
                        }
                    }
                })
                .then(function(check) {
                    if (check) {
                        if (type_loc === 'tỉnh/thành phố' && (String(Number(code)) === 'NaN' || Number(code) < 1 || Number(code) > 63 || code.length !== 2)) {
                            alert('Mã phải là số gồm hai chữ số trong khoảng 01 đến 63')
                            return false
                        } else if (type_loc === 'quận/huyện' && (String(Number(code)) === 'NaN' || code.length !== 4 || Number(code.substring(0, 2)) !== Number(username))) {
                            alert('Mã phải là số gồm 4 chữ số với 2 chữ số đầu trùng với mã tỉnh/thành phố của bạn')
                            return false

                        } else if (type_loc === 'xã/phường' && (String(Number(code)) === 'NaN' || code.length !== 6 || Number(code.substring(0, 4)) !== Number(username))) {
                            alert('Mã phải là số gồm 6 chữ số với 4 chữ số đầu trùng với mã quận/huyện của bạn')
                            return false

                        } else {
                            return true
                        }
                    }
                })
                .then(function(check) {
                    if (check) {
                        if (jQuery.inArray(code, codes_th) !== -1 || jQuery.inArray(loc, locs_th) !== -1) {
                            alert('Mã hoặc ' + type_loc + ' này đã được cấp')
                            $(this).parent().children('.loc').val("")
                            $(this).parent().children('.id').val("")
                            return false
                        } else {
                            return true
                        }
                    }
                })
                .then(function(check) {
                    if (check) {
                        loc = titleCase(loc)

                        var data = {
                            cityID: code,
                            cityName: loc,

                            districtID: code,
                            districtName: loc,

                            wardID: code,
                            wardName: loc,

                            villageID: code,
                            villageName: loc,
                        }

                        console.log("Data def_id_loc để gửi đi:      " + data);
                        var render = new Promise((resolve, reject) => {
                            if (roles === 'A1') {
                                url = "http://localhost:3000/city"
                            }
                            if (roles === 'A2') {
                                url = "http://localhost:3000/district"
                            }
                            if (roles === "A3") {
                                url = "http://localhost:3000/ward"
                            }
                            if (roles === "B1") {
                                url = "http://localhost:3000/village"
                            }
                            let t = post_data(url, data)

                            resolve(t)
                        });
                        render
                            .then(function(t) {
                                if (roles === 'A1') {
                                    loc_id.set(t.cityName, t._id)
                                }
                                if (roles === "A2") {
                                    loc_id.set(t.districtName, t._id)
                                }
                                if (roles === "A3") {
                                    loc_id.set(t.wardName, t._id)
                                }
                                if (roles === "B1") {
                                    loc_id.set(t.villageName, t._id)
                                }

                                console.log("Map loc_id:     " + loc_id)

                                var table = $('#table-infor-acc').DataTable();
                                var new_row = $(`
                                <tr>
                                    <td class="coll-0"><input type="checkbox"></td>
                                    <td class="coll-1">${code}</td>
                                    <td class="coll-2">${loc}</td>
                                    <td class="coll-3">Chưa cấp</td>
                                    <td class="coll-4">
                                        <label for="from" class="from-label">Từ: </label>
                                        <input type="text" class="from" id="from" disabled='disabled'>
                                        <br>
                                        <label for="to" class="to-label">Đến: </label>
                                        <input type="text" class="to" id="to" disabled='disabled'>
                                    </td>
                                    
                                    
                                    
                                    <td class="coll-7">Chưa hoàn thành<i class="fa fa-times complete-0" aria-hidden="true"></i></td>
                                    <td class="coll-6">
                                    <button type="button" onclick="renderForFixAcc(this)" class="btn fix-info" data-toggle="modal" data-target="#model-fix-acc">
                                        <i class="fa fa-pencil" aria-hidden="true"></i>
                                    </button>
                                </td>
                                    <td class="coll-8">
                                        <button type="button" onclick="render_reask_delete(this)" class="btn delete-info" data-toggle="modal" data-target="#delete-acc-modal">
                                            <i class="fa fa-trash" aria-hidden="true"></i>
                                        </button>
                                    </td>
                                </tr>`)
                                table.row.add(new_row[0]).draw();

                                alert('Đã cấp thành công')

                            })
                            .catch(function(t) {
                                console.log("Lỗi tại def_id_loc: hàm cấp mã")
                            })
                    }
                })

            .catch(function() {
                console.log('Lỗi tại def_id_loc: hàm cấp mã')
            })
        } else {
            alert('Bạn đã hết thời gian hoạt động')
        }

    })

}

function def_acc() {
    $('.def-acc .btn').click(function() {
        console.log('def_acc')
        if (active === '1') {
            var username = $(this).parent().children('.username').val()
            var pass = $(this).parent().children('.password').val()
            var pass_conf = $(this).parent().children('.password-conf').val()
            var type_loc = ""
            if (roles === "A1") {
                type_loc = 'tỉnh/thành phố'
            } else if (roles === "A2") {
                type_loc = 'quận/huyện'
            } else if (roles === "A3") {
                type_loc = 'xã/phường'
            }
            var loc = $(this).parent().children('.loc').val()
            var timeStart = $(this).parent().children('.from').val()
            var timeFinish = $(this).parent().children('.to').val()

            var code = ''
            var username_in_table = ''
            var row_to_append = ''
            var list_loc = $('.table-infor tbody .coll-2').map(function() {
                    if ($(this).html().toLowerCase() === loc.toLowerCase()) {
                        code = $(this).parent().children('.coll-1').html()
                        username_in_table = $(this).parent().children('.coll-3').html()
                        row_to_append = $(this).parent()
                    }
                    return $(this).html().toLowerCase()
                })
                // Clear form
            $(this).parent().children('.username').val('')
            $(this).parent().children('.password').val('')
            $(this).parent().children('.password-conf').val('')
            $(this).parent().children('.loc').val('')
            $(this).parent().children('.from').val('')
            $(this).parent().children('.to').val('')

            var check = new Promise(function(resolve, reject) {

                if (username === '' || pass === '' || loc === '' || timeStart === '' || timeFinish === '') {
                    alert('Bạn chưa điền đủ thông tin')
                    resolve(false)
                } else {
                    resolve(true)
                }
            })

            check
                .then(function(check) {
                    if (check) {
                        console.log(loc.toLowerCase())
                        console.log(list_loc)
                        if (jQuery.inArray(loc.toLowerCase(), list_loc) === -1) {
                            alert(titleCase(type_loc) + ' này chưa được cấp mã')
                            return false
                        } else {
                            return true
                        }
                    } else {
                        return false
                    }
                })
                .then(function(check) {
                    if (check) {
                        console.log(username_in_table)
                        if (username_in_table !== 'Chưa cấp') {
                            alert(titleCase(type_loc) + ' này đã được cấp tài khoản')
                            return false
                        } else {
                            return true
                        }
                    } else {
                        return false
                    }
                })
                .then(function(check) {
                    if (check) {
                        console.log("codeeee    " + code)
                        console.log("ussername   " + username)
                        if (code !== username) {
                            alert('Tên đăng nhập phải trùng với mã của ' + type_loc)
                            return false
                        } else {
                            return true
                        }
                    } else {
                        return false
                    }
                })
                .then(function(check) {
                    if (check) {
                        if (pass !== pass_conf) {
                            alert('Xác nhận mật khẩu chưa chính xác')
                            return false
                        } else {
                            return true
                        }
                    } else {
                        return false
                    }

                })
                .then(function(check) {
                    if (check) {
                        result = "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
                        regex = new RegExp(result)
                        if (pass.match(regex)) {
                            return true
                        } else {
                            alert("Mật khẩu bắt buộc có: tối thiểu 8 ký tự, có ít nhất một chữ cái in hoa, một chữ cái in thường, một ký tự đặc biệt")
                            return false
                        }
                    } else {
                        return false
                    }
                })
                .then(function(check) {
                    if (check) {
                        console.log(row_to_append)
                        var data = {
                            username: username,
                            password: pass,
                            timeStart: timeStart,
                            timeFinish: timeFinish,
                            complete: 0 /////////////////////////////////////////////
                        }
                        var url = ''
                        if (roles === "A1") {
                            url = "http://localhost:3000/A2"
                        } else if (roles === 'A2') {
                            url = "http://localhost:3000/A3"

                        } else if (roles === 'A3') {
                            url = "http://localhost:3000/B1"

                        } else if (roles === 'B1') {
                            url = "http://localhost:3000/B2"

                        }

                        console.log("Data để cấp tài khoản:    " + data);
                        var render = new Promise((resolve, reject) => {
                            let t = post_data(url, data)
                            resolve(t)
                        });
                        render
                            .then(function() {
                                var new_row = row_to_append
                                $(new_row).children('.coll-3').html(username)
                                $(new_row).children('.coll-4').children('.from').val(modifydatetime(timeStart))
                                $(new_row).children('.coll-4').children('.to').val(modifydatetime(timeFinish))

                                var table = $('#table-infor-acc').DataTable();
                                table
                                    .row($(row_to_append))
                                    .remove()
                                    .draw();

                                table.row.add(new_row).draw();

                                alert('Đã cấp tài khoản thành công')
                            })
                            .catch(function(t) {
                                console.log("Lỗi ở hàm def_acc")
                            })
                    }
                })
        } else {
            alert('Bạn đã hết thời gian hoạt động')
        }
    })
}

// Xóa tài khoản
function deleteInforAcc() {
    console.log('deleteInforAcc')
    if (active === '1') {

        console.log(delete_id)
        var data = {
            cityID: delete_id,
            districtID: delete_id,
            wardID: delete_id,
            villageID: delete_id
        }

        var render = new Promise((resolve, reject) => {
            if (roles == 'A1') {
                delete_data("http://localhost:3000/city", data)
            }
            if (roles == 'A2') {
                delete_data("http://localhost:3000/district", data)
            }
            if (roles == 'A3') {
                delete_data("http://localhost:3000/ward", data)
            }
            if (roles == 'B1') {
                delete_data("http://localhost:3000/village", data)
            }

            resolve()
        });
        render
            .then(function() {
                var row = $("#table-infor-acc tbody tr")
                var found;
                for (var i = 0; i < row.length; i++) {
                    if ($(row[i]).children('.coll-1').html() === delete_id) {
                        found = row[i];
                        break;
                    }
                }
                var loc = $(found).children('.coll-2').html()
                loc_id.delete(loc)

                var table = $('#table-infor-acc').DataTable();
                table
                    .row($(found))
                    .remove()
                    .draw();

            })
    } else {
        alert('Bạn đã hết thời gian hoạt động')

    }
}
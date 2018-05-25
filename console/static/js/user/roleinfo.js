// 格式化日期,
function showFormatDate(cellValue){
	return formatDate(new Date(cellValue),"yyyy-MM-dd hh:mm:ss");  
}
function formatDate(date, format) {
	var paddNum = function (num) {
        num += "";
        return num.replace(/^(\d)$/, "0$1");
    }
    //指定格式字符
    var cfg = {
        yyyy: date.getFullYear() //年 : 4位
        , yy: date.getFullYear().toString().substring(2)//年 : 2位
        , M: date.getMonth() + 1  //月 : 如果1位的时候不补0
        , MM: paddNum(date.getMonth() + 1) //月 : 如果1位的时候补0
        , d: date.getDate()   //日 : 如果1位的时候不补0
        , dd: paddNum(date.getDate())//日 : 如果1位的时候补0
        , hh: date.getHours()  //时
        , mm: date.getMinutes() //分
        , ss: date.getSeconds() //秒
    }
    format || (format = "yyyy-MM-dd hh:mm:ss");
    return format.replace(/([a-z])(\1)*/ig, function (m) {
        return cfg[m];
    });
}
(function() {
	$('#exampleTableEvents').bootstrapTable({
	      url: "/userInfo/getRoleList",
	      search: true,
	      pagination: true,
	      showRefresh: true,
	      showColumns: true,
	      iconSize: 'outline',
	      toolbar: '#exampleTableEventsToolbar',
	      icons: {
	        refresh: 'glyphicon-repeat'
	      }
	    });
 })(document, window, jQuery);
//用户添加展示模态框
function showAddUserModal(){
	$('#userAddDetail').modal('show');
};
//保存用户erp信息到fbase表中
function addRole() {
	//获取用户输入的erp列表
	var roleId = $('#roleId').val();
	var roleName = $('#roleName').val();
	//提交数据库
	$.ajax({
		url:"/userInfo/addRole",
		type:"post",
        contentType:"application/x-www-form-urlencoded; charset=UTF-8",
        dataType:"json",
        data:{
        	"roleId":roleId,
        	"roleName":roleName
        },
		success: function(data){
			if(data.code === 0){
				//关闭模态框
				$('#userAddDetail').modal('hide');
				//更新页面
				$('#exampleTableEvents').bootstrapTable('refresh', {url: '/userInfo/getRoleList'});
			}else {
				alert(data.msg);
			}
        }
	});
}
//根据用户id删除用户
function delRoles() {
	//获取用户ids
	var selectedTaskRows = $('#exampleTableEvents').bootstrapTable('getSelections');
	var ids = [];
    for (var i = 0; i < selectedTaskRows.length; i++) {
		ids.push(selectedTaskRows[i].role_id);
	}
    swal({
  	  title: "删除角色",
	  type: "warning",
	  showCancelButton: true,
	  confirmButtonColor: "#DD6B55",
	  confirmButtonText: "执行",
	  closeOnConfirm: false
  	},
	  function(){
	  	//执行ajax提交
		$.ajax({
			url:"/userInfo/delRole",
	        type:"post",
	        async: false,
	        contentType:"application/x-www-form-urlencoded; charset=UTF-8",
	        dataType:"json",
	        data:{
	            "roleIds":JSON.stringify(ids)
	        },
			success: function(data){
				if(data.code == 0){
					swal("删除!", "删除成功", "success");
					//更新页面
                    $('#exampleTableEvents').bootstrapTable('refresh', {url: '/userInfo/getRoleList'});
	            }	    				
	        },
	        error: function(res){
	        	swal("操作失败", res, "error");
	        }
	  	});
  	});
}
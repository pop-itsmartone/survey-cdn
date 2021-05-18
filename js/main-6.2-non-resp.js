Number.prototype.formatMoney = function(c, d, t){
var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

String.prototype.paddingLeft = function (paddingValue) {
   return String(paddingValue + this).slice(-paddingValue.length);
};


var navBarTopOffset = parseInt($(".navbar-fixed-top").css('top'));

var ieVersion=null;
if(navigator.appVersion.match(/MSIE ([\d.]+)/)!=null){
	var ieVersion=navigator.appVersion.match(/MSIE ([\d.]+)/)[1];
}

var notSupportIEText="Feature นี้ไม่ support IE ที่ต่ำกว่า version 8. กรุณาใช้งานด้วย Firefox, Chrome, หรือ IE 8 ขึ้นไป";

$(window).scroll(function(){
    $('.navbar-fixed-top').css({
        'top': $(this).scrollTop() + navBarTopOffset //Use it later
    });
});

//cookie
$.cookie.json = true;
var showHideCookie=$.cookie('bpk_hd_showhide');
if (showHideCookie===undefined){
	showHideCookie={};
}

$(document).ready(function() {
	$.ajaxSetup({ cache: false });
	$('[rel=tooltip]').tooltip();
	$('.combobox').combobox();
	initAjaxTypeahead();
	initShowHideSection();
	initDateOrDateTimePicker();
	initButtonCloseWindow();
	updateOpenerWindowDataTable();
	initCheckboxCancelExistingImage();
	initCheckboxRemoveAttachment();
	initInputPosInteger();
	initInputPosDecimal();
} );

function inJSONArray(value,json){
	for(var i in json){
		if(json[i]==value) return 0;
	}
	return -1;
}

function initInputPosInteger(){
	$(".pos-integer").numeric({ decimal:false, negative : false });
}

function initInputPosDecimal(){
	$(".pos-decimal").numeric({ decimal:".", negative : false });
	$(".pos-decimal-withcomma").numeric({ decimal:".", negative : false, withcomma : true });
}

function initCheckboxRemoveAttachment(){
	$("label.checkbox.attachment input").change(function(){
		if($(this).is(":checked")){
			$(this).parent().prev('span.href-file').addClass("line-through");
		}
		else{
			$(this).parent().prev('span.href-file').removeClass("line-through");
		}
	});
}

function initCheckboxCancelExistingImage(){
	$("input[name=inputCancelExistingImage]").change(function(){
		if($(this).is(":checked")){
			$(this).closest('.controls').find(".existingImage").hide();
			$(this).closest('.controls').find(".defaultImage").show();
		}
		else{
			$(this).closest('.controls').find(".existingImage").show();
			$(this).closest('.controls').find(".defaultImage").hide();
		}
	});
}
function updateOpenerWindowDataTable(){
	if($("#updating_datatable_id").size()>0 && window.opener!=null){
		try{
			window.opener.bpkDataTableSearchSubmit2($("#updating_datatable_id").val());
		}catch(err){

		}
	}
}

function openModal(modalLabel,modelBody,hasConfirmButton,onConfirmFunction,backdrop){
	if(modalLabel=="success"){
		modalLabel="บันทึกสำเร็จ";
	}
	else if(modalLabel=="fail"){
		modalLabel="ผิดพลาด";	
		if(modelBody==null){
		modelBody="บันทึกไม่สำเร็จ เกิดข้อผิดพลาดขึ้น!";	
		}
	}

	$("#myModalLabel").html(modalLabel);
	$("#myModal .modal-body p").html(modelBody);

	if(hasConfirmButton){
		$("#myModal .btn.confirm").show();
		$("#myModal .btn.confirm").unbind();
		$("#myModal .btn.confirm").click(onConfirmFunction);
		$("#myModal .btn.modal-btn-close").text("Cancel");
	}
	else{
		$("#myModal .btn.confirm").hide();
		$("#myModal .btn.modal-btn-close").text("Close");
	}

	if(backdrop==null) backdrop=true;
	$('#myModal').modal({
		'backdrop':backdrop
	});
}

function initButtonCloseWindow(){
	$("button.btn-close-window").click(function(){
		window.close();
	});
}

function openBorrowForm(borrow_id,task_id){
	if(borrow_id==-1){
		window.open(borrowFormCreateUrl+'/'+task_id);
	}
	else{
		window.open(borrowFormUrl+'/'+borrow_id);
	}
}

function ISODateString(d){
  function pad(n){return n<10 ? '0'+n : n}
  return d.getUTCFullYear()+'-'
      + pad(d.getUTCMonth()+1)+'-'
      + pad(d.getUTCDate())
}

function getUserLevel(level){
	switch(level){
		case "0":
			return "ผู้ใช้งานทั่วไป";
			break;
		case "1":
			return "ผู้ออกรายงาน";
			break;
		case "2":
			return "IT ระดับปฏิบัติการ";
			break;
		case "3":
			return "IT ระดับผู้จัดการ";
			break;
		case "4":
			return "Super Admin";
			break;
	}
}

function DTSelectAll(dataTableId,onDTCheckboxChangeFunction){
	var dataTable=$("#"+dataTableId);
	if(dataTable==null) return;
	var nodes =  dataTable.dataTable().fnGetNodes();
  $('.dt-checkbox', nodes).not('.disabled').prop('checked',true);

	if(onDTCheckboxChangeFunction!=null){
		onDTCheckboxChangeFunction();
	}
}

function DTDeselectAll(dataTableId,onDTCheckboxChangeFunction){
	var dataTable=$("#"+dataTableId);
	if(dataTable==null) return;
	var nodes =  dataTable.dataTable().fnGetNodes();
  $('.dt-checkbox', nodes).not('.disabled').prop('checked',false);

	if(onDTCheckboxChangeFunction!=null){
		onDTCheckboxChangeFunction();
	}
}
function initDTCheckbox(dataTableId,onDTCheckboxChangeFunction){
	var dataTable=$("#"+dataTableId);
	if(dataTable==null) return;
	dataTable.find('th input.dt-checkbox').change(function() {
		if(this.checked) {
			dataTable.find('td input.dt-checkbox').not('.disabled').prop('checked',true);
		}
		else{
			dataTable.find('td input.dt-checkbox').not('.disabled').prop('checked',false);
		}
		if(onDTCheckboxChangeFunction!=null){
			onDTCheckboxChangeFunction();
		}
	});
	dataTable.find('td input.dt-checkbox').change(function() {
		if(!this.checked) {
			dataTable.find('th input.dt-checkbox').prop('checked',false);
		}
		if(onDTCheckboxChangeFunction!=null){
			onDTCheckboxChangeFunction();
		}
	});

}

function initAjaxTypeahead(){
	$(".ajax-typeahead").each(function(){
		var elem=$(this);
		elem.typeahead({
		    source: function (query, process) {
		    	return $.ajax({
		            url: elem.data('link'),
		            type: 'post',
		            data: { query: query },
		            dataType: 'json',
		            success: function (result) {
		                var resultList=result.options;
		                return process(resultList);
		            }
		        });
	        }
		});
	});		
}

function initDateOrDateTimePicker(){
	$('.datepicker').datetimepicker({
		maskInput: true,
		pickDate: true,
		pickTime: false, 
		pick12HourFormat: false,
    format: 'yyyy-MM-dd',
    language: 'en',
    autoclose: true,
    todayHighlight: true
  });
	$('.datetimepicker').datetimepicker({
		maskInput: true,
		pickDate: true,
		pickTime: true, 
		pick12HourFormat: false,
    format: 'yyyy-MM-dd hh:mm:ss',
    language: 'en',
    autoclose: true,
    todayHighlight: true
  });
  $('.datepicker,.datetimepicker').find("i.icon-remove").each(function(){
  	$(this).removeClass("icon-calendar").removeClass("icon-time");
  	$(this).parent().unbind();
  	$(this).parent().click(function(){
  		$(this).closest(".input-append").find("input").val("");
  	});
  });
}

function setShowHideCookie(containerClass,isShow){	
	showHideCookie['showhide_'+viewName+'_'+containerClass]=isShow;
	$.cookie('bpk_hd_showhide', showHideCookie, { expires: 365 });
}

function initShowHideSection(){
	$("div.show-hide-btn-group").each(function(){
		var containerClass=$(this).attr("data-container");
		var showButton=$(this).children(".btn-show");
		var hideButton=$(this).children(".btn-hide");
		showButton.click(function(){
			$("div."+containerClass).show();
			hideButton.show();
			showButton.hide();
			setShowHideCookie(containerClass,true);
		});
		hideButton.click(function(){
			$("div."+containerClass).hide();
			hideButton.hide();
			showButton.show();
			setShowHideCookie(containerClass,false);
		});
	});
}

function setShowHideFilterCookie(elem,isShow){
	var filterBoxElem=$(elem).closest(".filter-box");
	var filterBoxElems = $('div#container').find('div.filter-box');
	var nth=filterBoxElems.index(filterBoxElem); 
  showHideCookie['showhide_'+viewName+'_filter_'+nth]=isShow;
	$.cookie('bpk_hd_showhide', showHideCookie, { expires: 365 });
}

function showFilter(elem){
	$(elem).closest(".filter-box").find(".filter-content").show();
	$(elem).hide();
	$(elem).parent().find('.hide-filter-button').show();
	setShowHideFilterCookie(elem,true);
}

function hideFilter(elem){
	$(elem).closest(".filter-box").find(".filter-content").hide();
	$(elem).hide();
	$(elem).parent().find('.show-filter-button').show();
	setShowHideFilterCookie(elem,false);
}

function jumpTo(elem_id){
	scrollToElem($("#"+elem_id));
}

function scrollToElem(elem, offset){
	if(offset==null) offset=100;
	var posY=$(elem).offset().top - offset;
	$('html, body').animate({ scrollTop: posY}, 200);
}

function focusAndScrollToElem(elem, offset){
	if($(elem).hasClass('combobox')){
		elem=$(elem).siblings('div.combobox-container');
		$(elem).find('input[type=text]').focus();
	}
	else{
		$(elem).focus();
	}
	scrollToElem(elem,offset);
}

function bootstrapFileInputChange(elem,checkType){
	if($(elem).val()!=""){
		var fileUploadDivElem=$(elem).closest("div.fileupload");
		if($(elem).closest("div.fileupload").is(".fileupload-last")){
			var newElem=$(elem).closest("div.fileupload").clone();
			fileUploadDivElem.removeClass("fileupload-last");
			fileUploadDivElem.after(newElem);
			newElem.find("input[type=file]").val("");
			newElem.find("input[type=hidden]").val("");
		}
		if(checkType!=null){
			if(checkType=="project"){
				checkProjectFileUploadLimit(elem);
			}
			else if(checkType=="task"){
				checkTaskFileUploadLimit(elem);
			}
		}
	}
}

//Datatable
var bpkDataTable=null;
var dataTableCustomColumnDef=[
		    { "bSortable": false, "aTargets": [ "sort-false" ] },
		    { "bSearchable": false, "aTargets": [ "search-false" ] }
		];

var sSearchDelay=500;


function bpkDataTableDrawCallback(oSettings,defaultOrderNumber,noRefresh,orderNumberColumn){
	if(defaultOrderNumber==null) defaultOrderNumber=true;
	if(orderNumberColumn==null) orderNumberColumn='0';
	if(defaultOrderNumber){
		var iDisplayStart=oSettings._iDisplayStart;
		for ( var i=0, iLen=oSettings.aiDisplay.length ; i<iLen ; i++ )
		{
			if(oSettings.sAjaxSource==null){
				$('td:eq('+orderNumberColumn+')', oSettings.aoData[ oSettings.aiDisplay[i] ].nTr ).html( i+1 );
			}
			else{
				$('td:eq('+orderNumberColumn+')', oSettings.aoData[ oSettings.aiDisplay[i] ].nTr ).html( i+1+iDisplayStart );
			}
		}
	}
	$('[rel=tooltip]',oSettings.nTable).tooltip();
	var dataTableWrapper=$(oSettings.nTable).parent();

	if(noRefresh==null || !noRefresh){
		//check if first init
		if($('.dataTables_length button.datatable-refresh-btn',dataTableWrapper).size()==0){
			$('.dataTables_length',dataTableWrapper).prepend(
				$('<button class="btn datatable-refresh-btn"><i class="icon-refresh"></i></button>')
					.click(function(){
						bpkDataTableSearchSubmit($(oSettings.nTable));
					}));
		}
	}
}

function bpkDataTableSearchSubmit(dataTable){
	if(dataTable==null) dataTable=bpkDataTable;
	var oSetting =dataTable.dataTable().fnSettings();
	oSetting._iDisplayStart = 0;
	dataTable.dataTable()._fnAjaxUpdate();	
}
function bpkDataTableSearchSubmit2(dataTableId){
	var dataTable=$("#"+dataTableId);
	if(dataTable==null) return;
	bpkDataTableSearchSubmit(dataTable);
}

function addTaskActionProblem(elem){
	var elemDetailClone=$(".problem-detail:last").clone();
	elemDetailClone.find('div.combobox-container').remove();
	elemDetailClone.find('.combobox').each(function(){
		$(this).attr('name',$(this).attr('attr-name'));
		$(this).show();
		$(this).combobox();
	});
	$(".problem-detail:last").after(elemDetailClone);
	$(".problem-detail .btn.remove").removeClass('hide');

	var inputProblemTypeElem=elemDetailClone.find('select[attr-name^=inputTaskActionProblemType]');
	var inputProblemTopicElem=elemDetailClone.find('select[attr-name^=inputTaskActionProblemTopic]');
	var inputProblemDetailElem=elemDetailClone.find('textarea[name^=inputTaskActionDescription]');

	inputProblemTypeElem.change(function(){
		ajaxGetProblemTopicFromProblemType(inputProblemTypeElem,inputProblemTopicElem,null,null);
	});
	inputProblemTopicElem.change(function(){
		var detail=inputProblemTopicElem.find('option[value='+$(this).val()+']').attr('attr-detail-template');
		if(detail!=null && detail!=""){
			inputProblemDetailElem.val(detail);
		}
	});
}

function removeTaskActionProblem(elem){
	if($(".problem-detail").size()>1){
		$(elem).closest(".problem-detail").remove();
		if($(".problem-detail").size()==1){
			$(".problem-detail .btn.remove").addClass('hide');
		}
	}
}

function addPreviousTask(elem){
	if($(elem).closest('.control-group').hasClass('last') && $(elem).val()!=''){
		var elemDetailClone=$(".previous-task.last").clone();
		elemDetailClone.find('div.combobox-container').remove();
		elemDetailClone.find('.combobox').each(function(){
			$(this).attr('name',$(this).attr('attr-name'));
			$(this).show();
			$(this).combobox();
		});
		$(elem).closest('.control-group').after(elemDetailClone);
		$(elem).closest('.control-group').removeClass('last');
		$(elem).closest('.control-group').find(".btn.remove").removeClass('hide');
	}
}

function removePreviousTask(elem){
	if($(".previous-task").size()>1){
		$(elem).closest(".previous-task").remove();
		if($(".previous-task").size()==1){
			$(".previous-task .btn.remove").addClass('hide');
		}
	}
}

function addMoreSection(elem){
	var controlGroup=$(elem).closest('div.control-group');
	controlGroup.find('.view-only').val($(elem).val());
	if($(elem).val()!="-1"){
		if(controlGroup.hasClass('last')){
			var controlGroupClone=$(elem).closest('div.control-group').clone();
			controlGroupClone.find('div.combobox-container').remove();
			controlGroupClone.find('.view-only').val("");
			controlGroupClone.find('.combobox').each(function(){
				$(this).attr('name',$(this).attr('attr-name'));
				$(this).show();
				if($(this).hasClass('inputSectionId')){
					$('option' ,this).not('.first-option').remove();
				}
				$(this).combobox();
			});
			controlGroup.after(controlGroupClone);
			controlGroup.removeClass('last');
			controlGroup.find('.btn.remove').removeClass('hide');
		}
	}

}

function removeSection(elem){	
	var controlGroup=$(elem).closest('div.control-group');
	controlGroup.remove();
}

function addMoreEmpGroup(elem){
	var controlGroup=$(elem).closest('div.control-group');
	controlGroup.find('.view-only').val($(elem).val());
	if($(elem).val()!="-1"){
		if(controlGroup.hasClass('last')){
			var controlGroupClone=$(elem).closest('div.control-group').clone();
			controlGroupClone.find('div.combobox-container').remove();
			controlGroupClone.find('.view-only').val("");
			controlGroupClone.find('.combobox').each(function(){
				$(this).attr('name',$(this).attr('attr-name'));
				$(this).show();
				$(this).combobox();
			});
			controlGroup.after(controlGroupClone);
			controlGroup.removeClass('last');
			controlGroup.find('.btn.remove').removeClass('hide');
		}
	}
}

function removeEmpGroup(elem){	
	var controlGroup=$(elem).closest('div.control-group');
	controlGroup.remove();
}

function removeExistDocToEmp(elem){
	var elemParent=$(elem).closest(".controls");
	var elemGrandParent=$(elem).closest(".control-group");
	$(elem).after('<input type="hidden" name="inputRemovingDocToEmpId[]" class="removingDocToEmpId" value="'+$(elem).attr('doc-to-emp-id')+'" />');
	
	elemParent.siblings(".control-label").addClass("line-through").addClass("muted");
	elemParent.find("label,span").addClass("line-through").addClass("muted");
	elemGrandParent.parent().next(".box-input-detail").children(".control-group").find("label,span").addClass("line-through").addClass("muted");
	elemParent.children(".cancel-remove").show();
	$(elem).hide();
}
function cancelRemoveExistDocToEmp(elem,type){
	var elemParent=$(elem).closest(".controls");
	var elemGrandParent=$(elem).closest(".control-group");
	elemParent.find(".removingDocToEmpId").remove();
	elemParent.siblings(".control-label").removeClass("line-through").removeClass("muted");
	elemParent.find("label,span").removeClass("line-through").removeClass("muted");
	elemGrandParent.parent().next(".box-input-detail").children(".control-group").find("label,span").removeClass("line-through").removeClass("muted");
	elemParent.children(".remove").show();
	$(elem).hide();
}

function removeExistDocToEmpGroup(elem){
	var elemParent=$(elem).closest(".controls");
	var elemGrandParent=$(elem).closest(".control-group");
	$(elem).after('<input type="hidden" name="inputRemovingDocToEmpGroupId[]" class="removingDocToEmpGroupId" value="'+$(elem).attr('doc-to-emp-group-id')+'" />');
	
	elemParent.siblings(".control-label").addClass("line-through").addClass("muted");
	elemParent.find("label,span").addClass("line-through").addClass("muted");
	elemParent.children(".cancel-remove").show();
	$(elem).hide();
}
function cancelRemoveExistDocToEmpGroup(elem,type){
	var elemParent=$(elem).closest(".controls");
	var elemGrandParent=$(elem).closest(".control-group");
	elemParent.find(".removingDocToEmpGroupId").remove();
	elemParent.siblings(".control-label").removeClass("line-through").removeClass("muted");
	elemParent.find("label,span").removeClass("line-through").removeClass("muted");
	elemParent.children(".remove").show();
	$(elem).hide();
}

function removeExistDocToSection(elem){
	var elemParent=$(elem).closest(".controls");
	var elemGrandParent=$(elem).closest(".control-group");
	$(elem).after('<input type="hidden" name="inputRemovingDocToSectionId[]" class="removingDocToSectionId" value="'+$(elem).attr('doc-to-section-id')+'" />');
	
	elemParent.siblings(".control-label").addClass("line-through").addClass("muted");
	elemParent.find("label,span").addClass("line-through").addClass("muted");
	elemParent.children(".cancel-remove").show();
	$(elem).hide();
}
function cancelRemoveExistDocToSection(elem,type){
	var elemParent=$(elem).closest(".controls");
	var elemGrandParent=$(elem).closest(".control-group");
	elemParent.find(".removingDocToSectionId").remove();
	elemParent.siblings(".control-label").removeClass("line-through").removeClass("muted");
	elemParent.find("label,span").removeClass("line-through").removeClass("muted");
	elemParent.children(".remove").show();
	$(elem).hide();
}

function removeExistEmpSection(elem){
	var elemParent=$(elem).closest(".controls");
	var elemGrandParent=$(elem).closest(".control-group");
	$(elem).after('<input type="hidden" name="inputRemovingEmpSectionId[]" class="removingEmpSectionId" value="'+$(elem).attr('emp-section-id')+'" />');
	
	elemParent.siblings(".control-label").addClass("line-through").addClass("muted");
	elemParent.find("label,span").addClass("line-through").addClass("muted");
	elemParent.children(".cancel-remove").show();
	$(elem).hide();
}
function cancelRemoveExistEmpSection(elem,type){
	var elemParent=$(elem).closest(".controls");
	var elemGrandParent=$(elem).closest(".control-group");
	elemParent.find(".removingEmpSectionId").remove();
	elemParent.siblings(".control-label").removeClass("line-through").removeClass("muted");
	elemParent.find("label,span").removeClass("line-through").removeClass("muted");
	elemParent.children(".remove").show();
	$(elem).hide();
}


//select dms document function
var selectingDmsDocumentElem=null;
function selectDmsDocumentCallback(doc_id,doc_name,file_type,file_size){
	var elem=selectingDmsDocumentElem;
	var elemHead=$(elem).closest(".choose-dms-doc-head");
	var elemDetail=$(elemHead).next(".choose-dms-doc-detail");

	// if last, clone and append empty elem
	if($(elemHead).hasClass("last")){
		var newElemHead=elemHead.clone();
		var newElemDetail=elemDetail.clone();
		elemDetail.after(newElemHead);
		newElemHead.after(newElemDetail);
		elemHead.removeClass("last");
		elemDetail.removeClass("last");
	}
	//change value
	var elemParent=$(elem).parent();
	elemParent.children(".change").removeClass("hide");
	elemParent.children(".remove").removeClass("hide");
	elemParent.children(".select").addClass("hide");
	var elemRefDocId=$(elem).siblings(".inputDmsDocId");
	elemRefDocId.val(doc_id);
	elemDetail.find("span.inputDmsDocId").html(doc_id);
	elemDetail.find("span.inputDmsDocName").html(doc_name=="null"?"":doc_name);
	elemDetail.find("span.inputDmsDocFileType").html(file_type=="null"?"":file_type);
	elemDetail.find("span.inputDmsDocFileSize").html(file_size=="null"?"":(file_size/1024/1024).formatMoney(2,'.',',')+" MB");
}
var adminSelectDmsDocumentWindow=null;
function selectDmsDoc(elem,url){
	if(url==null) url=adminSelectDmsDocUrl;
	selectingDmsDocumentElem=elem;
	if(adminSelectDmsDocumentWindow!=null){
		adminSelectDmsDocumentWindow.close();
	}
	adminSelectDmsDocumentWindow=window.open(url,'select_dms_document');
	adminSelectDmsDocumentWindow.focus();
}
function removeDmsDoc(elem){
	var elemHead=$(elem).closest(".choose-dms-doc-head");
	var elemDetail=$(elemHead).next(".choose-dms-doc-detail");

	//change value
	var elemParent=$(elem).parent();
	elemParent.children(".change").addClass("hide");
	elemParent.children(".remove").addClass("hide");
	elemParent.children(".select").removeClass("hide");
	var elemRefDocId=$(elem).siblings(".inputDmsDocId");
	elemRefDocId.val("");
	elemDetail.find("span.inputDmsDocId").html("");
	elemDetail.find("span.inputDmsDocName").html("");
	elemDetail.find("span.inputDmsDocFileType").html("");
	elemDetail.find("span.inputDmsDocFileSize").html("");
}
//end select dms document function


//select document function
var selectingDocumentElem=null;
function selectDocumentCallback(doc_id,doc_name,file_name,file_size){
	var elem=selectingDocumentElem;
	var elemHead=$(elem).closest(".ref-doc-head");
	var elemDetail=$(elemHead).next(".ref-doc-detail");

	// if last, clone and append empty elem
	if($(elemHead).hasClass("last")){
		var newElemHead=elemHead.clone();
		var newElemDetail=elemDetail.clone();
		elemDetail.after(newElemHead);
		newElemHead.after(newElemDetail);
		elemHead.removeClass("last");
		elemDetail.removeClass("last");
	}
	//change value
	var elemParent=$(elem).parent();
	elemParent.children(".change").removeClass("hide");
	elemParent.children(".remove").removeClass("hide");
	elemParent.children(".select").addClass("hide");
	var elemRefDocId=$(elem).siblings(".inputRefDocId");
	elemRefDocId.val(doc_id);
	elemDetail.find("span.inputRefDocId").html(doc_id);
	elemDetail.find("span.inputRefDocName").html(doc_name=="null"?"":doc_name);
	elemDetail.find("span.inputRefDocFileName").html(file_name=="null"?"":file_name);
	elemDetail.find("span.inputRefDocFileSize").html(file_size=="null"?"":(file_size/1024/1024).formatMoney(2,'.',',')+" MB");
}
var adminSelectDocumentWindow=null;
function selectRefDoc(elem,url){
	if(url==null) url=adminSelectDocUrl;
	selectingDocumentElem=elem;
	if(adminSelectDocumentWindow!=null){
		adminSelectDocumentWindow.close();
	}
	adminSelectDocumentWindow=window.open(url,'select_document');
	adminSelectDocumentWindow.focus();
}
function removeRefDoc(elem){
	var elemHead=$(elem).closest(".ref-doc-head");
	var elemDetail=$(elemHead).next(".ref-doc-detail");

	//change value
	var elemParent=$(elem).parent();
	elemParent.children(".change").addClass("hide");
	elemParent.children(".remove").addClass("hide");
	elemParent.children(".select").removeClass("hide");
	var elemRefDocId=$(elem).siblings(".inputRefDocId");
	elemRefDocId.val("");
	elemDetail.find("span.inputRefDocId").html("");
	elemDetail.find("span.inputRefDocName").html("");
	elemDetail.find("span.inputRefDocFileName").html("");
	elemDetail.find("span.inputRefDocFileSize").html("");
}
//end select document function

//select wsitem function
var selectingWsItemElem=null;
function selectWsItemCallback(itemtype_detail,wsitem_id,brand,serial,ws_id,model,hos_detail,section_detail){
	var elem=selectingWsItemElem;
	var elemHead=$(elem).closest(".wsitem-head");
	var elemDetail=$(elemHead).next(".wsitem-detail");

	// if last, clone and append empty elem
	if($(elemHead).hasClass("last")){
		var newElemHead=elemHead.clone();
		var newElemDetail=elemDetail.clone();
		elemDetail.after(newElemHead);
		newElemHead.after(newElemDetail);
		elemHead.removeClass("last");
		elemDetail.removeClass("last");
	}
	//change value
	var elemParent=$(elem).parent();
	elemParent.children(".change").removeClass("hide");
	elemParent.children(".remove").removeClass("hide");
	elemParent.children(".select").addClass("hide");
	var elemWsId=$(elem).siblings(".inputWsItemId");
	elemWsId.val(wsitem_id);
	elemDetail.find("span.inputItemType").html(itemtype_detail);
	elemDetail.find("span.inputItemBrand").html(brand);
	elemDetail.find("span.inputItemSN").html(serial);
	elemDetail.find("span.inputItemWS").html(ws_id);
	elemDetail.find("span.inputWsItemId").html(wsitem_id);
	elemDetail.find("span.inputItemModel").html(model);
	elemDetail.find("span.inputItemSectionDetail").html(hos_detail);
	elemDetail.find("span.inputItemHosDetail").html(section_detail);
}
function selectWsItem(elem,url){
	if(url==null) url=selectWsItemUrl;
	selectingWsItemElem=elem;
	var selectWsItemWindow=window.open(url,'select_wsitem');
	selectWsItemWindow.focus();
}
function removeWsItem(elem){
	var elemHead=$(elem).closest(".wsitem-head");
	var elemDetail=$(elemHead).next(".wsitem-detail");

	//change value
	var elemParent=$(elem).parent();
	elemParent.children(".change").addClass("hide");
	elemParent.children(".remove").addClass("hide");
	elemParent.children(".select").removeClass("hide");
	var elemWsId=$(elem).siblings(".inputWsItemId");
	elemWsId.val("");
	elemDetail.find("span.inputItemType").html("");
	elemDetail.find("span.inputItemBrand").html("");
	elemDetail.find("span.inputItemSN").html("");
	elemDetail.find("span.inputItemWS").html("");
	elemDetail.find("span.inputWsItemId").html("");
	elemDetail.find("span.inputItemModel").html("");
	elemDetail.find("span.inputItemSectionDetail").html("");
	elemDetail.find("span.inputItemHosDetail").html("");
}
function removeExistWsItem(elem,type){
	if(type==null) type="task";
	var elemParent=$(elem).closest(".controls");
	var elemGrandParent=$(elem).closest(".control-group");
	if(type=="project"){
		$(elem).after('<input type="hidden" name="inputRemovingProjectWsItemId[]" class="removingProjectWsItemId" value="'+$(elem).attr('project-wsitem-id')+'" />');
	}
	else{
		$(elem).after('<input type="hidden" name="inputRemovingTaskWsItemId[]" class="removingTaskWsItemId" value="'+$(elem).attr('task-wsitem-id')+'" />');
	}
	elemParent.siblings(".control-label").addClass("line-through").addClass("muted");
	elemParent.find("label,span").addClass("line-through").addClass("muted");
	elemGrandParent.nextAll(".control-group").slice(0, 2).find("label,span").addClass("line-through").addClass("muted");
	//elemGrandParent.next(".control-group").next(".control-group").find("label,span").addClass("line-through").addClass("muted");
	elemParent.children(".cancel-remove").show();
	$(elem).hide();
}
function cancelRemoveExistWsItem(elem,type){
	if(type==null) type="task";
	var elemParent=$(elem).closest(".controls");
	var elemGrandParent=$(elem).closest(".control-group");
	if(type=="project"){
		elemParent.find(".removingProjectWsItemId").remove();
	}
	else{
		elemParent.find(".removingTaskWsItemId").remove();
	}
	elemParent.siblings(".control-label").removeClass("line-through").removeClass("muted");
	elemParent.find("label,span").removeClass("line-through").removeClass("muted");
	elemGrandParent.nextAll(".control-group").slice(0, 2).find("label,span").removeClass("line-through").removeClass("muted");
	//elemGrandParent.next(".control-group").next(".control-group").find("label,span").removeClass("line-through").removeClass("muted");
	elemParent.children(".remove").show();
	$(elem).hide();
}
//end select wsitem function


//select employee function
var selectingEmployeeElem=null;
var typeAheadUpdaterCheck=false;
function initSelectEmployeeTypeahead(elem){
	elem.typeahead({
		 	updater: function(item) {
        // do what you want with the item here
        if(!typeAheadUpdaterCheck){
        	typeAheadUpdaterCheck=true;
	        var spacePos=item.indexOf(" - ");
	        var emp_id=item.substring(0,spacePos);
	        selectingEmployeeElem=$(elem).siblings('button.btn.select');					        
					$.ajax({
						  type: 'POST',
						  url: ajaxGetEmpDataUrl,
						  data:  {"emp_id":emp_id},
						  success: function(data) {
	        			selectEmployeeCallback(emp_id,data.ename+" "+data.esurname,data.hos_detail,data.section_detail,data.position,data.section_id);
							},
						  dataType: "json",
						  async:true
						});
	        setTimeout(function(){
	        	typeAheadUpdaterCheck=false;
	        },300);
	      }
        return item;
	    },
	    source: function (query, process) {
	    	return $.ajax({
	            url: elem.data('link'),
	            type: 'post',
	            data: { query: query },
	            dataType: 'json',
	            success: function (result) {
	                var resultList=result.options;
	                return process(resultList);
	            }
	        });
        }
	});
}
$(".inputSelectEmployeeTypeahead").each(function(){
	var elem=$(this);
	initSelectEmployeeTypeahead(elem);
});	
function selectEmployeeCallback(emp_id,emp_name,hos_detail,section_detail,position,section_id){
	if($("#isEmpToEmpGroupAdd").size()>0 && $("#isEmpToEmpGroupAdd").val()=="true"){
		showPageLoading();
		var emp_group_id=$("#inputEmpGroupId").val();
		$.post(ajaxAddEmpToEmpGroupAdminUrl, {"emp_id":emp_id ,"emp_group_id":emp_group_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","เพิ่มพนักงานเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(bpkDataTable);
			}
			else if(data.success=="EXIST"){
				openModal("fail","ไม่สามารถเพิ่มได้ เนื่องจากพนักงานนี้เป็นสมาชิกในกลุ่มอยู่แล้ว",false,null);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
		return;
	}
	if(hos_detail==null || hos_detail=="null"){
		hos_detail="";
	}
	if(section_detail==null || section_detail=="null"){
		section_detail="";
	}
	if(position==null || position=="null"){
		position="";
	}
	var elem=selectingEmployeeElem;
	var elemHead=$(elem).closest(".emp-head");
	var elemDetail=$(elemHead).next(".emp-detail");

	// if last, clone and append empty elem
	if($(elem).siblings(".inputTaskCoInchargeEmpId").size()>0 && $(elemHead).hasClass("last")){
		var newElemHead=elemHead.clone();
		var newElemDetail=elemDetail.clone();
		elemDetail.after(newElemHead);
		newElemHead.after(newElemDetail);
		elemHead.removeClass("last");
		elemDetail.removeClass("last");
		newElemHead.find(".inputSelectEmployeeTypeahead").each(function(){
			initSelectEmployeeTypeahead($(this));
		});	
		newElemHead.find('input').val('');
	}
	else if($(elem).siblings(".inputProjectCoInchargeEmpId").size()>0 && $(elemHead).hasClass("last")){
		var newElemHead=elemHead.clone();
		var newElemDetail=elemDetail.clone();
		elemDetail.after(newElemHead);
		newElemHead.after(newElemDetail);
		elemHead.removeClass("last");
		elemDetail.removeClass("last");
		newElemHead.find(".inputSelectEmployeeTypeahead").each(function(){
			initSelectEmployeeTypeahead($(this));
		});	
		newElemHead.find('input').val('');
	}

	//change value
	var elemParent=$(elem).parent();
	elemParent.children(".change").removeClass("hide");
	elemParent.children(".remove").removeClass("hide");
	elemParent.children(".select").addClass("hide");
	var elem=selectingEmployeeElem;
	if($(elem).siblings(".inputTaskCoInchargeEmpId").size()>0){		
		var elemEmpId=$(elem).siblings(".inputTaskCoInchargeEmpId");
		elemEmpId.val(emp_id);
		elemDetail.find("span.inputEmpName").html(emp_name);
		elemDetail.find("span.inputEmpHospital").html(hos_detail);
		elemDetail.find("span.inputEmpSection").html(section_detail);
		elemDetail.find("span.inputEmpPosition").html(position);
		$(elem).parent().find('.view-only').val(emp_id);
	}
	else if($(elem).siblings(".inputProjectCoInchargeEmpId").size()>0){		
		var elemEmpId=$(elem).siblings(".inputProjectCoInchargeEmpId");
		elemEmpId.val(emp_id);
		elemDetail.find("span.inputEmpName").html(emp_name);
		elemDetail.find("span.inputEmpHospital").html(hos_detail);
		elemDetail.find("span.inputEmpSection").html(section_detail);
		elemDetail.find("span.inputEmpPosition").html(position);
		$(elem).parent().find('.view-only').val(emp_id);
	}
	else{
		var elemEmpId=$(elem).siblings(".inputEmployeeId");
		elemEmpId.val(emp_id);
		elemDetail.find("span.inputEmpName").html(emp_name);
		elemDetail.find("input[name=inputInChargeEmpName]").val(emp_name);
		$("#inputInChargeEmpSectionId").val(section_id);
		elemDetail.find("span.inputEmpHospital").html(hos_detail);
		elemDetail.find("span.inputEmpSection").html(section_detail);
		elemDetail.find("span.inputEmpPosition").html(position);

		if($("#inputTaskServiceType").size()>0){
			ajaxGetServiceType($("#inputRequestType"),$("#inputInChargeEmpSectionId"),$("#inputTaskServiceType"),null,'T',function(){
				ajaxGetService($("#inputTaskServiceType"),$("#inputTaskService"),null,'T');
			});
		}
	}
}
var selectEmployeeWindow=null;
function selectEmployee(elem){
	selectingEmployeeElem=elem;
	if(selectEmployeeWindow!=null){
		selectEmployeeWindow.close();
	}
	selectEmployeeWindow=window.open(selectEmployeeUrl,'select_emp');
	selectEmployeeWindow.focus();
}
function removeEmployee(elem){
	var elemHead=$(elem).closest(".emp-head");
	var elemDetail=$(elemHead).next(".emp-detail");

	//change value
	var elemParent=$(elem).parent();
	elemParent.children(".change").addClass("hide");
	elemParent.children(".remove").addClass("hide");
	elemParent.children(".select").removeClass("hide");
	elemParent.children(".inputSelectEmployeeTypeahead").val('');
	if($(elem).siblings(".inputTaskCoInchargeEmpId").size()>0){		
		var elemEmpId=$(elem).siblings(".inputTaskCoInchargeEmpId");
		elemEmpId.val("");
		elemDetail.find("span.inputEmpName").html("");
		elemDetail.find("span.inputEmpHospital").html("");
		elemDetail.find("span.inputEmpSection").html("");
		elemDetail.find("span.inputEmpPosition").html("");
		$(elem).parent().find('.view-only').val("");
	}
	else if($(elem).siblings(".inputProjectCoInchargeEmpId").size()>0){		
		var elemEmpId=$(elem).siblings(".inputProjectCoInchargeEmpId");
		elemEmpId.val("");
		elemDetail.find("span.inputEmpName").html("");
		elemDetail.find("span.inputEmpHospital").html("");
		elemDetail.find("span.inputEmpSection").html("");
		elemDetail.find("span.inputEmpPosition").html("");
		$(elem).parent().find('.view-only').val("");
	}
	else{
		var elemEmpId=$(elem).siblings(".inputEmployeeId");
		elemEmpId.val("");
		elemDetail.find("span.inputEmpName").html("");
		elemDetail.find("span.inputEmpHospital").html("");
		elemDetail.find("span.inputEmpSection").html("");
		elemDetail.find("span.inputEmpPosition").html("");
		$("#inputInChargeEmpSectionId").val("-1");

		if($("#inputTaskServiceType").size()>0){
			ajaxGetServiceType($("#inputRequestType"),$("#inputInChargeEmpSectionId"),$("#inputTaskServiceType"),null,'T',function(){
				ajaxGetService($("#inputTaskServiceType"),$("#inputTaskService"),null,'T');
			});
		}
	}
}
//end select employee function


//select project function
var selectingProjectElem=null;
function initSelectProjectTypeahead(elem){
	elem.typeahead({
		 	updater: function(item) {
        // do what you want with the item here
        if(!typeAheadUpdaterCheck){
        	typeAheadUpdaterCheck=true;
	        var spacePos=item.indexOf(" - ");
	        var project_id=item.substring(0,spacePos);
	        var title=item.substring(spacePos+3);
	        selectingProjectElem=$(elem);
	        selectProjectCallback(project_id,title);
	        setTimeout(function(){
	        	typeAheadUpdaterCheck=false;
	        },300);
	      }
        return item;
	    },
	    source: function (query, process) {
	    	return $.ajax({
	            url: elem.data('link'),
	            type: 'post',
	            data: { query: query },
	            dataType: 'json',
	            success: function (result) {
	                var resultList=result.options;
	                return process(resultList);
	            }
	        });
        }
	});
}
$(".inputSelectProjectTypeahead").each(function(){
	var elem=$(this);
	initSelectProjectTypeahead(elem);
});	
function selectProjectCallback(project_id,title){
	var elem=selectingProjectElem;

	//change value
	var elemParent=$(elem).parent();
	elemParent.children(".change").removeClass("hide");
	elemParent.children(".remove").removeClass("hide");
	elemParent.children(".select").addClass("hide");
	var elemRefProjectId=$(elem).siblings(".inputRefProjectId");
	elemRefProjectId.val(project_id);
	var elemRefProjectTitle=$(elem).siblings(".refProjectTitle");
	elemRefProjectTitle.html('<a href="'+projectViewUrl+'/'+project_id+'" target="_blank" class="btn btn-primary btn-mini pull-left"><i class="icon-search icon-white"></i> View</a> '+project_id+ '-' +title);
	elemRefProjectTitle.removeClass("hide");
}
var selectProjectWindow=null;
function selectProject(elem){
	selectingProjectElem=elem;
	if(selectProjectWindow!=null){
		selectProjectWindow.close();
	}
	selectProjectWindow=window.open(selectProjectUrl,'select_project');
	selectProjectWindow.focus();
}
function removeProject(elem){
	//change value
	var elemParent=$(elem).parent();
	elemParent.children(".change").addClass("hide");
	elemParent.children(".remove").addClass("hide");
	elemParent.children(".select").removeClass("hide");
	var elemRefProjectId=$(elem).siblings(".inputRefProjectId");
	elemRefProjectId.val("");
	var elemRefProjectTitle=$(elem).siblings(".refProjectTitle");
	elemRefProjectTitle.html('');
	elemRefProjectTitle.addClass("hide");
}
//end select project function


//input validation
function updateInputErrMsg(errMsg,inputField){	
	if(errMsg!=""){
		$(inputField).closest("div.control-group").addClass('error');
		if($(inputField).closest("div.control-group").find('span.help-inline').size()!=0){
			$(inputField).closest("div.control-group").find('span.help-inline').text(errMsg);
		}
		else{
			$(inputField).closest("div.control-group").find('span.help-block').text(errMsg);
		}
		focusAndScrollToElem($(inputField));
	}
	else{
		$(inputField).closest("div.control-group").removeClass('error');
		if($(inputField).closest("div.control-group").find('span.help-inline').size()!=0){
			$(inputField).closest("div.control-group").find('span.help-inline').text("");
		}
		else{
			$(inputField).closest("div.control-group").find('span.help-block').text("");
		}
	}
}

function checkInputTypeDateBetween(inputFieldStart,inputFieldEnd){
	var passValidate=true;	
	var inputDateStart=inputFieldStart.val();
	var inputDateEnd=inputFieldEnd.val();
	var errMsg="";
	var focusField=inputFieldEnd;
	if(inputDateStart==""){
		errMsg="กรุณากรอกข้อมูล";
		passValidate=false;
		focusField=inputFieldStart;
	}
	else if(inputDateEnd==""){
		errMsg="กรุณากรอกข้อมูล";
		passValidate=false;
	}
	else if(inputDateStart>inputDateEnd){
		errMsg="ระบุช่วงเวลาผิดพลาด";
		passValidate=false;
	}
	updateInputErrMsg(errMsg,focusField);
	return passValidate;
}

function checkInputTypeHidden(inputField,focusTarget){
	var passValidate=true;	
	var inputData=inputField.val();
	var errMsg="";
	if(inputData==""){
		errMsg="กรุณากรอกข้อมูล";
		passValidate=false;
	}
	updateInputErrMsg(errMsg,focusTarget);
	return passValidate;
}

function checkInputTypeSelect(inputField){
	var passValidate=true;	
	var inputData=inputField.val();
	if(inputField.hasClass('combobox')){
		inputData=inputField.siblings("div.combobox-container").find("input[type=hidden]").val();
	}
	var errMsg="";
	if(inputData=="-1" || inputData==""){
		errMsg="กรุณากรอกข้อมูล";
		passValidate=false;
	}
	updateInputErrMsg(errMsg,inputField);
	return passValidate;
}

function checkInputTypeText(inputField,inputLength){
	var passValidate=true;	
	var inputData=inputField.val();
	var errMsg="";
	if(inputData==""){
		errMsg="กรุณากรอกข้อมูล";
		passValidate=false;
	}
	else if(inputLength!=null && inputData.length<inputLength){
		errMsg="กรุณากรอกข้อมูลอย่างนอ้ย 3 ตัวอักษร";
		passValidate=false;
	}
	updateInputErrMsg(errMsg,inputField);
	return passValidate;
}
//end input validation

function openModalViewFullDetail(detail){
	openModal("รายละเอียด",detail,false,null);	
}
function openModalViewFullDetail2(elem){
	openModalViewFullDetail($(elem).attr('attr-detail'));
}
function openModalViewFullDetail3(elem){
	openModalViewFullDetail($(elem).html());
}

function refreshComboBox(elem,newValue){
	if(newValue==null) newValue="-1";
	$(elem).find('option').attr('selected',false);
	$(elem).find('option[value="'+newValue+'"]').attr('selected',true);
	$(elem).siblings("div.combobox-container").find("input[type=hidden]").val(newValue);
	$(elem).combobox('refresh');
	$(elem).val(newValue);
}

function scrollIntoView(element, container) {
  var containerTop = $(container).scrollTop(); 
  var containerBottom = containerTop + $(container).height(); 
  var elemTop = element.get(0).offsetTop;
  var elemBottom = elemTop + $(element).height(); 
  if (elemTop < containerTop) {
    $(container).scrollTop(elemTop);
  } else if (elemBottom > containerBottom) {
    $(container).scrollTop(elemBottom - $(container).height());
  }
}

//ajax get section
function ajaxGetSectionFromHospital(inputHospitalElem,inputSectionElem,defaultValue,isUsed,onComplete){
	var hosId=inputHospitalElem.val();
	if(isUsed==null) isUsed="null";
	showPageLoading();
	$.post(ajaxGetSectionFromHospitalUrl, {"hosId":hosId ,"isused":isUsed}, function(data) {
		var optionHtml='';
		for(var i in data){
			if(defaultValue!=null && data[i].section_id==defaultValue){
				optionHtml+='<option value="'+data[i].section_id+'" selected="selected">'+data[i].section_detail+'</option>';
			}
			else{
				optionHtml+='<option value="'+data[i].section_id+'">'+data[i].section_detail+'</option>';
			}
		}
		inputSectionElem.find('option[class!="first-option"]').remove()
		inputSectionElem.append(optionHtml);
		if(onComplete!=null){
			onComplete();
		}
		if(inputSectionElem.hasClass('combobox')){
			if(defaultValue==null){
				inputSectionElem.combobox('clearElement');
				inputSectionElem.combobox('clearTarget');
			}
			else{
				inputSectionElem.siblings("div.combobox-container").find("input[type=hidden]").val(defaultValue);
			}
			inputSectionElem.combobox('refresh');
		}
	},"json").always(function() { hidePageLoading(); });
}
//end ajax get section

//ajax get division
function ajaxGetDivisionFromHospital(inputHospitalElem,inputDivisionElem,defaultValue,isUsed,onComplete){
	var hosId=inputHospitalElem.val();
	if(isUsed==null) isUsed="null";
	showPageLoading();
	$.post(ajaxGetDivisionFromHospitalUrl, {"hosId":hosId ,"isused":isUsed}, function(data) {
		var optionHtml='';
		for(var i in data){
			if(defaultValue!=null && data[i].division_id==defaultValue){
				optionHtml+='<option value="'+data[i].division_id+'" selected="selected">'+data[i].name+'</option>';
			}
			else{
				optionHtml+='<option value="'+data[i].division_id+'">'+data[i].name+'</option>';
			}
		}
		inputDivisionElem.find('option[class!="first-option"]').remove()
		inputDivisionElem.append(optionHtml);
		if(onComplete!=null){
			onComplete();
		}
		if(inputDivisionElem.hasClass('combobox')){
			if(defaultValue==null){
				inputDivisionElem.combobox('clearElement');
				inputDivisionElem.combobox('clearTarget');
			}
			else{
				inputDivisionElem.siblings("div.combobox-container").find("input[type=hidden]").val(defaultValue);
			}
			inputDivisionElem.combobox('refresh');
		}
	},"json").always(function() { hidePageLoading(); });
}
//end ajax get division

//ajax get servicetype
function ajaxGetServiceType(inputRequestTypeElem,inputSectionElem,inputServiceTypeElem,defaultValue,isUsed,onComplete){
	var sectionId=inputSectionElem.val();
	var requestTypeId=inputRequestTypeElem.val();

	if(isUsed==null) isUsed="null";
	showPageLoading();
	$.post(ajaxGetServiceTypeUrl, {"requestTypeId":requestTypeId ,"sectionId":sectionId ,"isused":isUsed}, function(data) {
		var optionHtml='';
		for(var i in data){
			if(defaultValue!=null && data[i].servicetype_id==defaultValue){
				optionHtml+='<option value="'+data[i].servicetype_id+'" selected="selected">'+data[i].detail+'</option>';
			}
			else{
				optionHtml+='<option value="'+data[i].servicetype_id+'">'+data[i].detail+'</option>';
			}
		}
		inputServiceTypeElem.find('option[class!="first-option"]').remove()
		inputServiceTypeElem.append(optionHtml);
		if(onComplete!=null){
			onComplete();
		}
		if(inputServiceTypeElem.hasClass('combobox')){
			if(defaultValue==null){
				inputServiceTypeElem.combobox('clearElement');
				inputServiceTypeElem.combobox('clearTarget');
			}
			else{
				inputServiceTypeElem.siblings("div.combobox-container").find("input[type=hidden]").val(defaultValue);
			}
			inputServiceTypeElem.combobox('refresh');
		}
	},"json").always(function() { hidePageLoading(); });
}
//end ajax get servicetype


//ajax get service_point
function ajaxGetServicePoint(inputSectionElem,inputServicePointElem,defaultValue,isUsed,onComplete){
	var sectionId;
	if(inputSectionElem!=null){
		sectionId=inputSectionElem.val();
	}

	if(isUsed==null) isUsed="null";
	showPageLoading();
	$.post(ajaxGetServicePointUrl, {"sectionId":sectionId ,"isused":isUsed}, function(data) {
		var optionHtml='';
		for(var i in data){
			if(defaultValue!=null && data[i].service_point_id==defaultValue){
				optionHtml+='<option value="'+data[i].service_point_id+'" selected="selected">'+data[i].detail+'</option>';
			}
			else{
				optionHtml+='<option value="'+data[i].service_point_id+'">'+data[i].detail+'</option>';
			}
		}
		inputServicePointElem.find('option[class!="first-option"]').remove()
		inputServicePointElem.append(optionHtml);
		if(onComplete!=null){
			onComplete();
		}
		if(inputServicePointElem.hasClass('combobox')){
			if(defaultValue==null){
				inputServicePointElem.combobox('clearElement');
				inputServicePointElem.combobox('clearTarget');
			}
			else{
				inputServicePointElem.siblings("div.combobox-container").find("input[type=hidden]").val(defaultValue);
			}
			inputServicePointElem.combobox('refresh');
		}
	},"json").always(function() { hidePageLoading(); });
}
//end ajax get service_point


//ajax get service
function ajaxGetService(inputServiceTypeElem,inputServiceElem,defaultValue,isUsed){
	var serviceTypeId=inputServiceTypeElem.val();
	if(isUsed==null) isUsed="null";
	showPageLoading();
	$.post(ajaxGetServiceUrl, {"serviceTypeId":serviceTypeId ,"isused":isUsed}, function(data) {
		var optionHtml='';
		for(var i in data){
			if(defaultValue!=null && data[i].service_id==defaultValue){
				optionHtml+='<option value="'+data[i].service_id+'" selected="selected" attr-detail-template="'+(data[i].detail_template!=null?data[i].detail_template:"")+'">'+data[i].service_detail+'</option>';
			}
			else{
				optionHtml+='<option value="'+data[i].service_id+'" attr-detail-template="'+(data[i].detail_template!=null?data[i].detail_template:"")+'">'+data[i].service_detail+'</option>';
			}
		}
		inputServiceElem.find('option[class!="first-option"]').remove()
		inputServiceElem.append(optionHtml);
	},"json").always(function() { hidePageLoading(); });
}
//end ajax get service

//ajax get workstation
function ajaxGetWorkstationFromSection(inputSectionElem,inputWorkStationElem,defaultValue,isUsed,onComplete){
	var sectionId=inputSectionElem.val();
	if(isUsed==null) isUsed="null";
	showPageLoading();
	$.post(ajaxGetWorkstationFromSectionUrl, {"sectionId":sectionId ,"isused":isUsed}, function(data) {
		var optionHtml='';
		for(var i in data){
			if(defaultValue!=null && data[i].ws_id==defaultValue){
				optionHtml+='<option value="'+data[i].ws_id+'" selected="selected">'+data[i].ws_detail+'</option>';
			}
			else{
				optionHtml+='<option value="'+data[i].ws_id+'">'+data[i].ws_detail+'</option>';
			}
		}
		inputWorkStationElem.find('option[class!="first-option"]').remove()
		inputWorkStationElem.append(optionHtml);
		if(onComplete!=null){
			onComplete();
		}
		if(inputWorkStationElem.hasClass('combobox')){
			if(defaultValue==null){
				inputWorkStationElem.combobox('clearElement');
				inputWorkStationElem.combobox('clearTarget');
			}
			else{
				inputWorkStationElem.siblings("div.combobox-container").find("input[type=hidden]").val(defaultValue);
			}
			inputWorkStationElem.combobox('refresh');
		}
	},"json").always(function() { hidePageLoading(); });
}
//end ajax get workstation

//ajax get problemtype
function ajaxGetProblemTypeFromSection(inputSectionElem,inputProblemTypeElem,defaultValue,isUsed,onComplete){
	var sectionId=inputSectionElem.val();
	if(isUsed==null) isUsed="null";
	showPageLoading();
	$.post(ajaxGetProblemTypeFromSectionUrl, {"sectionId":sectionId ,"isused":isUsed}, function(data) {
		var optionHtml='';
		for(var i in data){
			if(defaultValue!=null && data[i].problemtype_id==defaultValue){
				optionHtml+='<option value="'+data[i].problemtype_id+'" selected="selected">'+data[i].detail+'</option>';
			}
			else{
				optionHtml+='<option value="'+data[i].problemtype_id+'">'+data[i].detail+'</option>';
			}
		}
		inputProblemTypeElem.find('option[class!="first-option"]').remove()
		inputProblemTypeElem.append(optionHtml);
		if(onComplete!=null){
			onComplete();
		}
		if(inputProblemTypeElem.hasClass('combobox')){
			if(defaultValue==null){
				inputProblemTypeElem.combobox('clearElement');
				inputProblemTypeElem.combobox('clearTarget');
			}
			else{
				inputProblemTypeElem.siblings("div.combobox-container").find("input[type=hidden]").val(defaultValue);
			}
			inputProblemTypeElem.combobox('refresh');
		}
	},"json").always(function() { hidePageLoading(); });
}
//end ajax get problemtype

//ajax get problemtopic
function ajaxGetProblemTopicFromProblemType(inputProblemTypeElem,inputProblemTopicElem,defaultValue,isUsed,onComplete){
	var problemTypeId=inputProblemTypeElem.val();
	if(isUsed==null) isUsed="null";
	showPageLoading();
	$.post(ajaxGetProblemTopicFromProblemTypeUrl, {"problemTypeId":problemTypeId ,"isused":isUsed}, function(data) {
		var optionHtml='';
		for(var i in data){
			if(defaultValue!=null && data[i].problem_topic_id==defaultValue){
				optionHtml+='<option value="'+data[i].problem_topic_id+'" selected="selected" attr-detail-template="'+data[i].detail_template+'">'+data[i].detail+'</option>';
			}
			else{
				optionHtml+='<option value="'+data[i].problem_topic_id+'" attr-detail-template="'+(data[i].detail_template!=null?data[i].detail_template:"")+'">'+data[i].detail+'</option>';
			}
		}
		inputProblemTopicElem.find('option[class!="first-option"]').remove()
		inputProblemTopicElem.append(optionHtml);
		if(onComplete!=null){
			onComplete();
		}
		if(inputProblemTopicElem.hasClass('combobox')){
			if(defaultValue==null){
				inputProblemTopicElem.combobox('clearElement');
				inputProblemTopicElem.combobox('clearTarget');
			}
			else{
				inputProblemTopicElem.siblings("div.combobox-container").find("input[type=hidden]").val(defaultValue);
			}
			inputProblemTopicElem.combobox('refresh');
		}
	},"json").always(function() { hidePageLoading(); });
}
//end ajax get problemtype


//asset
//asset-manage
function validateAssetManageMoveActivityForm(){
	var passValidate=true;
	//check input bottom up
	// passValidate=checkInputTypeHidden($("input[name=inputEmployeeId]"),$("input[name=inputEmployeeId]").siblings(".btn.select")) && passValidate;
	passValidate=checkInputTypeSelect($("select[name=inputWsId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[name=inputSectionId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[name=inputEmpHospitalId]")) && passValidate;

	return passValidate;
}
function validateAssetActionForm(){
	var passValidate=true;
	//check input bottom up
	if($("select[id=inputActionId]").val()!="S" && $("#wsItemStatusId").val()=="0" && $("input[name=inputHasProject]:checked").val()=="yes"){
		passValidate=checkInputTypeHidden($("input[name=inputRefProjectId]"),$("input[name=inputRefProjectId]").siblings(".inputSelectProjectTypeahead")) && passValidate;
	}
	passValidate=checkInputTypeSelect($("select[id=inputActionId]")) && passValidate;

	if(passValidate && $("#wsItemStatusId").val()=="0" && $("select[id=inputActionId]").val()!="S"){
		if($("input[name=inputHasProject]:checked").val()=="yes"){
			window.location.href = projectNewTaskUrl+'/'+$("input[name=inputRefProjectId]").val()+'?wsitem_id='+$("input[name=inputWsItemId]").val()+'&asset_action_id='+$("#inputActionId").val();		
		}
		else if($("input[name=inputHasProject]:checked").val()=="no"){
			window.location.href = requestUrl+'/'+$("input[name=inputRefProjectId]").val()+'?wsitem_id='+$("input[name=inputWsItemId]").val()+'&asset_action_id='+$("#inputActionId").val();		
		}
		return false;
	}

	return passValidate;
}
if(viewName=="asset-manage"){
	$("select[id=inputActionId]").change(function(){
		if($(this).val()=="S"){
			$("#div-action-has-project").hide();
			$("#div-asset-action-project-select").hide();
			$("#div-action-submit button").hide();
			$("#button-asset-action-save").show();
		}
		else{
			$("input[name=inputHasProject]").prop('checked',false);
			$("input[name=inputHasProject][value=no]").prop('checked',true);
			$("#button-asset-action-create-project").show();
			$("#button-asset-action-create-task").hide();
			$("#div-action-has-project").show();
			$("#div-asset-action-project-select").hide();
		}
	});
	$("input[name=inputHasProject]").change(function(){
		if(!$(this).is(":checked")) return;
		var checkedValue=$(this).val();
		if(checkedValue=="yes"){
			$("#div-asset-action-project-select").show();
			$("#button-asset-action-create-project").hide();
			$("#button-asset-action-create-task").show();
		}
		else{
			$("#div-asset-action-project-select").hide();
			$("#button-asset-action-create-project").show();
			$("#button-asset-action-create-task").hide();
		}
	});
	$("#inputEmpHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputEmpHospitalId"),$("#inputSectionId"),null,null);
	});
	$("#inputSectionId").change(function(){
		ajaxGetWorkstationFromSection($("#inputSectionId"),$("#inputWsId"),null,null);
	});

	//Table History
	var bpkDataTableHistory=$('#wsitem-history-datatable').dataTable({
		"bFilter": false,
		"bJQueryUI": true,
		"sPaginationType": "full_numbers",
		"aoColumnDefs": dataTableCustomColumnDef,
		"aoColumns": [
	    { 	"mData" : null, "sClass": "right" },
      { 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return '<a target="_blank" href="'+employeeViewUrl+'/'+full.create_by+'" rel="tooltip" data-title="View">'+full.create_by_name+'</a>';
				}
			},
      { 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
					return full.hos_detail;
				}
			},
      { 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.section_detail;
				} 
			},
      { 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
					if(full.wsitem_action_id=="-1"){
						return 'จำหน่าย';
					}
					else if(full.wsitem_action_id=='1'){
						return full.wsitem_action_detail+' จาก '
						+'<a target="_blank" href="'+workstationViewUrl+'/'+full.object_id1+'" rel="tooltip" data-title="View">'+full.object_id1+'</a>'
						+' ไป '
						+'<a target="_blank" href="'+workstationViewUrl+'/'+full.object_id2+'" rel="tooltip" data-title="View">'+full.object_id2+'</a>';
					}
					else{
						var addition="";
						if(full.wsitem_action_id=='2' || full.wsitem_action_id=='5' || full.wsitem_action_id=='12'){
							addition='<a target="_blank" href="'+projectViewUrl+'/'+full.object_id1+'" rel="tooltip" data-title="View">'+full.object_id1+'</a>';
						}
						else if(full.wsitem_action_id=='6'){
							addition='<a target="_blank" href="'+taskViewUrl+'/'+full.object_id1+'" rel="tooltip" data-title="View">'+full.object_id1+'</a>';
						}
						else if(full.wsitem_action_id=='4' || full.wsitem_action_id=='7' || full.wsitem_action_id=='9' || full.wsitem_action_id=='10' || full.wsitem_action_id=='11'){
							if(full.object_id1!=null){
								addition='<a target="_blank" href="'+borrowViewUrl+'/'+full.object_id1+'" rel="tooltip" data-title="View">'+full.object_id1+'</a>';
							}
						}
						if(addition==""){
							return full.wsitem_action_detail;
						}
						else{
							return full.wsitem_action_detail+' ('+addition+')';
						}
					}
				} 
			},
      { 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
					return full.create_date;
				}
			}
    ],
    "aaSorting": [[ 5, "desc" ]],
		"bProcessing": true,
		"bServerSide": true,
		"sAjaxSource": dataTableAjaxSourceUrl_WsItemHistory,
		"sServerMethod": "POST",
		"fnDrawCallback": function ( oSettings ) {
			bpkDataTableDrawCallback(oSettings);
		}
	});
}
//end admin-manage
if(viewName=="asset-index"){
	// $("#inputEmpHospital").change(function(){
	// 	ajaxGetSectionFromHospital($("#inputEmpHospital"),$("#inputSectionId"),null,null);
	// });

	$("#inputEmpHospital").change(function(){
		ajaxGetSectionFromHospital($("#inputEmpHospital"),$("#inputSectionId"),null,null);
	});

	$("#inputEmpHospital").val(userHosId);
	ajaxGetSectionFromHospital($("#inputEmpHospital"),$("#inputSectionId"),userSectionId,'T',null);


	$("#inputEmpHospital").closest("form").on('reset',function() {
		setTimeout(function(){
			ajaxGetSectionFromHospital($("#inputEmpHospital"),$("#inputSectionId"),null,null);
	  },100);
	});


	$(document).ready(function() {
		bpkDataTable=$('#asset-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.wsitem_id;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.ws_id;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.hos_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.section_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.itemtype_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.wsitem_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.brand;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.serial;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.acc_id;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.med_id;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.incharge_emp_name;
					}
				},
							{ 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.can_borrow=='T'){
							return '<span class="label label-success">ยืมได้</span>';
						}
						else{
							return '<span class="label label-important">ยืมไม่ได้</span>';
						}
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.isused=='F'){
							return 'ไม่ใช้งาน';
						}
						else if(full.isused=='S'){
							return 'จำหน่าย';
						}
						return full.wsitem_status_detail;
					}
				},
				// { 	"mData" : null , "sClass": "center",
				// 	"mRender": function ( data, type, full ) {
				// 		return '<a target="_blank" href="'+wsitemViewUrl+'/'+full.wsitem_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="icon-search icon-white"></i></a>';
				// 	}
				// },	 
				{ 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						var returnHtml = '<a target="_blank" href="'+assetManageUrl+'/'+full.wsitem_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="icon-search icon-white"></i></a>';

            return returnHtml;
					}
				},
				{ 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						var returnHtml = '';
						returnHtml+='<div class="btn-group">'
		            		+'<a class="btn-more btn btn-info dropdown-toggle" data-toggle="dropdown" href="#">'
		            		+'	More'
		            		+'	<span class="caret"></span>'
		            		+'</a>'
		            		+'<ul class="dropdown-menu">'
			      if(inJSONArray("ASSET_ADMIN",session_app_permission_include) != -1){
            	returnHtml+='<li><a target="_blank" href="'+wsitemAdminEditUrl+'/'+full.wsitem_id+'"><span>แก้ไข</span></a></li>'
            }

			      if(inJSONArray("ASSET_WRITE_OFF",session_app_permission_include) != -1){
            	returnHtml+='<li><a target="_blank" href="'+wsitemAdminWriteOffUrl+'/'+full.wsitem_id+'"><span>ตัดจำหน่าย</span></a></li>'
			      }
			      
            		+'</ul>'
            	+'</div>';
            return returnHtml;
					}
				}
	        ],
	        "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
				aoData.push( { "name": "wsitem_id", "value": $("#inputItemId").val() } );
				aoData.push( { "name": "ws_id", "value": $("#inputWsId").val() } );
				aoData.push( { "name": "hos_id", "value": '' } );
				aoData.push( { "name": "itemtype_id", "value": $("#inputItemTypeId").val() } );
				aoData.push( { "name": "brand", "value": $("#inputItemBrand").val() } );
				aoData.push( { "name": "model", "value": $("#inputItemModel").val() } );
				aoData.push( { "name": "serial", "value": $("#inputItemSerial").val() } );
				aoData.push( { "name": "acc_id", "value": $("#inputItemAccId").val() } );
				aoData.push( { "name": "med_id", "value": $("#inputItemMedId").val() } );
				aoData.push( { "name": "incharge_emp_name", "value": $("#inputInchargeEmpName").val() } );
				aoData.push( { "name": "wsitem_status_id", "value": $("#inputWsItemStatusId").val() } );
				aoData.push( { "name": "item_view_type", "value": $("#inputItemViewtype").val() } );				
				aoData.push( { "name": "can_borrow", "value": $("#inputCanBorrow").val() } );
	      aoData.push( { "name": "section_id", "value": $("#inputSectionId").val() } );
	      aoData.push( { "name": "hos_id", "value": $("#inputEmpHospital").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-asset-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	});
}
//end asset


//borrow
function validateBorrowForm(){
	var passValidate=true;
	//check input bottom up
	if(borrowStatusKey=="create"){
		passValidate=checkInputTypeDateBetween($("#inputBorrowDateStart"),$("#inputBorrowDateEnd")) && passValidate;
		passValidate=checkInputTypeHidden($("input[name=inputWsItemId]"),$("input[name=inputWsItemId]").siblings(".btn.select")) && passValidate;	
	}
	else if(borrowStatusKey=="request_borrow"){
		passValidate=checkInputTypeDateBetween($("#inputAcceptDateStart"),$("#inputAcceptDateEnd")) && passValidate;
	}

	if(passValidate && borrowStatusKey=="create" && !confirmExistBorrow){
			checkWsItemBorrowExist($("input[name=inputWsItemId]").val()
				,$("input[name=inputBorrowDateStart]").val()
				,$("input[name=inputBorrowDateEnd]").val());
			return false;
	}
	return passValidate;
}
function clearWsItemBorrowExistAlert(){
	$("div.alert-request-borrow").hide();
}
function checkWsItemBorrowExist(wsitem_id,borrow_start_date,borrow_end_date){
	if(wsitem_id=="" || borrow_start_date=="" || borrow_end_date==""){
		clearWsItemBorrowExistAlert();
	}
	$.ajax({
		  type: 'POST',
		  url: checkWsItemBorrowExistUrl,
		  data:  {"wsitem_id":wsitem_id,"borrow_start_date":borrow_start_date,"borrow_end_date":borrow_end_date},
		  success: function(data) {
				if(data.exist){
					$("div.alert-request-borrow").show();
					$("div.alert-request-borrow span.borrow-date").html(data.accept_start_date.substring(0,10)+" ถึง "+data.accept_end_date.substring(0,10));
					
					openModal("ยืนยัน","Warning! พบการยืมอุปกรณ์นี้ในช่วง "+$("div.alert-request-borrow span.borrow-date").html(),true,function(){
						confirmExistBorrow=true;
						$("form#borrow-form").submit();
					});
				}
				else{
					clearWsItemBorrowExistAlert();
					confirmExistBorrow=true;
					$("form#borrow-form").submit();
				}
			},
		  dataType: "json",
		  async:false
		});
}
if(viewName=="borrow-borrow"){
	$(function(){
		// $("input[name=inputWsItemId], input[name=inputBorrowDateStart], input[name=inputBorrowDateEnd]").change(function(){
		// 	checkWsItemBorrowExist($("input[name=inputWsItemId]").val()
		// 		,$("input[name=inputBorrowDateStart]").val()
		// 		,$("input[name=inputBorrowDateEnd]").val());
		// });
	});
}
//end borrow


//borrow-index
if(viewName=="borrow-index" || viewName=="borrow-myborrow"){
	$("#inputHosId_Request").change(function(){
		ajaxGetSectionFromHospital($("#inputHosId_Request"),$("#inputSectionId_Request"),null,null);
	});
	$("#inputHosId_Waiting").change(function(){
		ajaxGetSectionFromHospital($("#inputHosId_Waiting"),$("#inputSectionId_Waiting"),null,null);
	});
	$("#inputHosId_Search").change(function(){
		ajaxGetSectionFromHospital($("#inputHosId_Search"),$("#inputSectionId_Search"),null,null);
	});

	$("#inputHosId_Request").val(userHosId);
	$("#inputHosId_Waiting").val(userHosId);
	$("#inputHosId_Search").val(userHosId);
	ajaxGetSectionFromHospital($("#inputHosId_Request"),$("#inputSectionId_Request"),userSectionId,'T',function(){ functionInitTableRequest(); });
	ajaxGetSectionFromHospital($("#inputHosId_Waiting"),$("#inputSectionId_Waiting"),userSectionId,'T',function(){ functionInitTableWaiting(); });
	ajaxGetSectionFromHospital($("#inputHosId_Search"),$("#inputSectionId_Search"),userSectionId,'T',function(){ functionInitTableSearch(); });

	$("#inputHosId_Request").closest("form").on('reset',function() {
		setTimeout(function(){
			ajaxGetSectionFromHospital($("#inputHosId_Request"),$("#inputSectionId_Request"),null,null);
	  },100);
	});

	$("#inputHosId_Waiting").closest("form").on('reset',function() {
		setTimeout(function(){
			ajaxGetSectionFromHospital($("#inputHosId_Waiting"),$("#inputSectionId_Waiting"),null,null);
	  },100);
	});
	
	$("#inputHosId_Search").closest("form").on('reset',function() {
		setTimeout(function(){
			ajaxGetSectionFromHospital($("#inputHosId_Search"),$("#inputSectionId_Search"),null,null);
	  },100);
	});

		//Table Request
		var functionInitTableRequest=function(){
			var bpkDataTableRequest=$('#request-borrow-datatable').dataTable({
				"bJQueryUI": true,
				"sPaginationType": "full_numbers",
				"aoColumnDefs": dataTableCustomColumnDef,
				"aoColumns": [
		      { 	"mData" : null, "sClass": "right" },
		      { 	"mData" : null,
						"mRender": function ( data, type, full ) {
							return full.task_id;
						}
					},
		      { 	"mData" : null,
						"mRender": function ( data, type, full ) {
							return full.wsitem_id;
						} 
					},
		      { 	"mData" : null, "sClass": "center",
						"mRender": function ( data, type, full ) {
							return full.hos_detail;
						} 
					},
		      { 	"mData" : null,
						"mRender": function ( data, type, full ) {
							return full.section_detail;
						}
					},
		      { 	"mData" : null,
						"mRender": function ( data, type, full ) {
							return full.itemtype_detail;
						}
					},
		      { 	"mData" : null,
						"mRender": function ( data, type, full ) {
							return full.brand;
						}
					},
		      { 	"mData" : null, "sClass": "center",
						"mRender": function ( data, type, full ) {
							return full.borrow_start_date.substring(0,10)+' ถึง<br/>'+full.borrow_end_date.substring(0,10);
						}
					},
		      { 	"mData" : null, "sClass": "center",
						"mRender": function ( data, type, full ) {
							return full.create_date;
						}
					},
		      { 	"mData" : null , "sClass": "center",
						"mRender": function ( data, type, full ) {
							return '<a href="'+borrowViewUrl+'/'+full.wsitem_borrow_id+'" target="_blank" class="btn btn-primary" rel="tooltip" data-title="ดูรายละเอียด"><i class="icon-search icon-white"></i></a>';
						}
					}
		    ],
		    "aaSorting": [[ 8, "asc" ]],
				"bProcessing": true,
				"bServerSide": true,
				"sAjaxSource": dataTableAjaxSourceUrl_Request,
				"sServerMethod": "POST",
				"fnServerParams": function ( aoData ) {
			      aoData.push( { "name": "task_id", "value": $("#inputTaskId_Request").val() } );
			      aoData.push( { "name": "wsitem_id", "value": $("#inputWsItemId_Request").val() } );
			      aoData.push( { "name": "hos_id", "value": $("#inputHosId_Request").val() } );
			      aoData.push( { "name": "section_id", "value": $("#inputSectionId_Request").val() } );
			      aoData.push( { "name": "itemtype_detail", "value": $("#inputItemTypeDetail_Request").val() } );
			      aoData.push( { "name": "brand", "value": $("#inputItemBrand_Request").val() } );
			      aoData.push( { "name": "borrow_date_start_start", "value": $("#inputBorrowDateStart_Start_Request").val() } );
			      aoData.push( { "name": "borrow_date_start_end", "value": $("#inputBorrowDateStart_End_Request").val() } );
			      aoData.push( { "name": "borrow_date_end_start", "value": $("#inputBorrowDateEnd_Start_Request").val() } );
			      aoData.push( { "name": "borrow_date_end_end", "value": $("#inputBorrowDateEnd_End_Request").val() } );
			      aoData.push( { "name": "inform_date_start", "value": $("#inputInformDateStart_Request").val() } );
			      aoData.push( { "name": "inform_date_end", "value": $("#inputInformDateEnd_Request").val() } );
			      aoData.push( { "name": "is_myborrow", "value": (viewName=="borrow-myborrow") } );
				},
				"fnDrawCallback": function ( oSettings ) {
					bpkDataTableDrawCallback(oSettings);
				}
			});

			bpkDataTableRequest.dataTable().fnSetFilteringDelay(sSearchDelay);

			$("#table-request-submit").click(function(){
				bpkDataTableSearchSubmit(bpkDataTableRequest);
				return false;
			});
		};

		//Table Waiting Return
		var functionInitTableWaiting=function(){
			var bpkDataTableWaiting=$('#waiting-borrow-datatable').dataTable({
				"bJQueryUI": true,
				"sPaginationType": "full_numbers",
				"aoColumnDefs": dataTableCustomColumnDef,
				"aoColumns": [
		      { 	"mData" : null, "sClass": "right" },
		      { 	"mData" : null,
						"mRender": function ( data, type, full ) {
							return full.task_id;
						}
					},
		      { 	"mData" : null,
						"mRender": function ( data, type, full ) {
							return full.wsitem_id;
						} 
					},
		      { 	"mData" : null, "sClass": "center",
						"mRender": function ( data, type, full ) {
							return full.hos_detail;
						} 
					},
		      { 	"mData" : null,
						"mRender": function ( data, type, full ) {
							return full.section_detail;
						}
					},
		      { 	"mData" : null,
						"mRender": function ( data, type, full ) {
							return full.itemtype_detail;
						}
					},
		      { 	"mData" : null,
						"mRender": function ( data, type, full ) {
							return full.brand;
						}
					},
		      { 	"mData" : null, "sClass": "center",
						"mRender": function ( data, type, full ) {
							return full.accept_start_date.substring(0,10)+' ถึง<br/>'+full.accept_end_date.substring(0,10);
						}
					},
		      { 	"mData" : null, "sClass": "center",
						"mRender": function ( data, type, full ) {
							return full.accept_end_date;
						}
					},
		      { 	"mData" : null , "sClass": "center",
						"mRender": function ( data, type, full ) {
							return '<a href="'+borrowViewUrl+'/'+full.wsitem_borrow_id+'" target="_blank" class="btn btn-primary" rel="tooltip" data-title="ดูรายละเอียด"><i class="icon-search icon-white"></i></a>';
						}
					}
		    ],
		    "aaSorting": [[ 8, "asc" ]],
				"bProcessing": true,
				"bServerSide": true,
				"sAjaxSource": dataTableAjaxSourceUrl_Waiting,
				"sServerMethod": "POST",
				"fnServerParams": function ( aoData ) {
			      aoData.push( { "name": "task_id", "value": $("#inputTaskId_Waiting").val() } );
			      aoData.push( { "name": "wsitem_id", "value": $("#inputWsItemId_Waiting").val() } );
			      aoData.push( { "name": "hos_id", "value": $("#inputHosId_Waiting").val() } );
			      aoData.push( { "name": "section_id", "value": $("#inputSectionId_Waiting").val() } );
			      aoData.push( { "name": "itemtype_detail", "value": $("#inputItemTypeDetail_Waiting").val() } );
			      aoData.push( { "name": "brand", "value": $("#inputItemBrand_Waiting").val() } );
			      aoData.push( { "name": "accept_date_start_start", "value": $("#inputAcceptDateStart_Start_Waiting").val() } );
			      aoData.push( { "name": "accept_date_start_end", "value": $("#inputAcceptDateStart_End_Waiting").val() } );
			      aoData.push( { "name": "accept_date_end_start", "value": $("#inputAcceptDateEnd_Start_Waiting").val() } );
			      aoData.push( { "name": "accept_date_end_end", "value": $("#inputAcceptDateEnd_Start_Waiting").val() } );
			      aoData.push( { "name": "is_myborrow", "value": (viewName=="borrow-myborrow") } );
				},
				"fnDrawCallback": function ( oSettings ) {
					bpkDataTableDrawCallback(oSettings);
				}
			});

			bpkDataTableWaiting.dataTable().fnSetFilteringDelay(sSearchDelay);

			$("#table-waiting-submit").click(function(){
				bpkDataTableSearchSubmit(bpkDataTableWaiting);
				return false;
			});
		};

		//Table Borrow Search
		var functionInitTableSearch=function(){
			var bpkDataTableSearch=$('#search-borrow-datatable').dataTable({
				"bJQueryUI": true,
				"sPaginationType": "full_numbers",
				"aoColumnDefs": dataTableCustomColumnDef,
				"aoColumns": [
		      { 	"mData" : null, "sClass": "right" },
		      { 	"mData" : null,
						"mRender": function ( data, type, full ) {
							return full.task_id;
						}
					},
		      { 	"mData" : null,
						"mRender": function ( data, type, full ) {
							return full.wsitem_id;
						} 
					},
		      { 	"mData" : null,
						"mRender": function ( data, type, full ) {
							return full.hos_detail;
						}
					},
		      { 	"mData" : null,
						"mRender": function ( data, type, full ) {
							return full.section_detail;
						}
					},
		      { 	"mData" : null,
						"mRender": function ( data, type, full ) {
							return full.itemtype_detail;
						}
					},
		      { 	"mData" : null,
						"mRender": function ( data, type, full ) {
							return full.brand;
						}
					},
		      { 	"mData" : null, "sClass": "center",
						"mRender": function ( data, type, full ) {
							return full.wsitem_borrow_status_detail;
						}
					},
		      { 	"mData" : null, "sClass": "center",
						"mRender": function ( data, type, full ) {
							return full.create_date;
						}
					},
		      { 	"mData" : null, "sClass": "center",
						"mRender": function ( data, type, full ) {
							if(full.borrow_start_date==null) return "";
							return full.borrow_start_date.substring(0,10)+' ถึง<br/>'+full.borrow_end_date.substring(0,10);
						}
					},
		      { 	"mData" : null, "sClass": "center",
						"mRender": function ( data, type, full ) {
							if(full.accept_start_date==null) return "";
							return full.accept_start_date.substring(0,10)+' ถึง<br/>'+full.accept_end_date.substring(0,10);
						}
					},
		      { 	"mData" : null, "sClass": "center",
						"mRender": function ( data, type, full ) {
							if(full.return_date==null) return "";
							return full.return_date.substring(0,10);
						}
					},
		      { 	"mData" : null , "sClass": "center",
						"mRender": function ( data, type, full ) {
							return '<a href="'+borrowViewUrl+'/'+full.wsitem_borrow_id+'" target="_blank" class="btn btn-primary" rel="tooltip" data-title="ดูรายละเอียด"><i class="icon-search icon-white"></i></a>';
						}
					}
		    ],
		    "aaSorting": [[ 8, "asc" ]],
				"bProcessing": true,
				"bServerSide": true,
				"sAjaxSource": dataTableAjaxSourceUrl_Search,
				"sServerMethod": "POST",
				"fnServerParams": function ( aoData ) {
			      aoData.push( { "name": "task_id", "value": $("#inputTaskId_Search").val() } );
			      aoData.push( { "name": "wsitem_id", "value": $("#inputWsItemId_Search").val() } );
			      aoData.push( { "name": "hos_id", "value": $("#inputHosId_Search").val() } );
			      aoData.push( { "name": "section_id", "value": $("#inputSectionId_Search").val() } );
			      aoData.push( { "name": "itemtype_detail", "value": $("#inputItemTypeDetail_Search").val() } );
			      aoData.push( { "name": "brand", "value": $("#inputItemBrand_Search").val() } );
			      aoData.push( { "name": "borrow_status_id", "value": $("#inputBorrowStatusId_Search").val() } );
			      aoData.push( { "name": "inform_date_start", "value": $("#inputCreateDate_Start_Search").val() } );
			      aoData.push( { "name": "inform_date_end", "value": $("#inputCreateDate_End_Search").val() } );
			      aoData.push( { "name": "borrow_date_start_start", "value": $("#inputBorrowDateStart_Start_Search").val() } );
			      aoData.push( { "name": "borrow_date_start_end", "value": $("#inputBorrowDateStart_End_Search").val() } );
			      aoData.push( { "name": "borrow_date_end_start", "value": $("#inputBorrowDateEnd_Start_Search").val() } );
			      aoData.push( { "name": "borrow_date_end_end", "value": $("#inputBorrowDateEnd_Start_Search").val() } );
			      aoData.push( { "name": "accept_date_start_start", "value": $("#inputAcceptDateStart_Start_Search").val() } );
			      aoData.push( { "name": "accept_date_start_end", "value": $("#inputAcceptDateStart_End_Search").val() } );
			      aoData.push( { "name": "accept_date_end_start", "value": $("#inputAcceptDateEnd_Start_Search").val() } );
			      aoData.push( { "name": "accept_date_end_end", "value": $("#inputAcceptDateEnd_Start_Search").val() } );
			      aoData.push( { "name": "return_date_start", "value": $("#inputReturnDate_Start_Search").val() } );
			      aoData.push( { "name": "return_date_end", "value": $("#inputReturnDate_End_Search").val() } );
			      aoData.push( { "name": "is_myborrow", "value": (viewName=="borrow-myborrow") } );
				},
				"fnDrawCallback": function ( oSettings ) {
					bpkDataTableDrawCallback(oSettings);
				}
			});

			bpkDataTableSearch.dataTable().fnSetFilteringDelay(sSearchDelay);

			$("#table-search-submit").click(function(){
				bpkDataTableSearchSubmit(bpkDataTableSearch);
				return false;
			});
		};
}
//end borrow-index


//coupon
function validateCouponAddForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputCouponDetail]")) && passValidate;

	return passValidate;
}
if(viewName=="coupon-add"){
	var calCouponFunction=function(){
		var yearStart=$("#inputYearStart").val();
		var yearEnd=$("#inputYearEnd").val();
		var hosCode=$("#inputHospitalCode").val();
		var couponValue=$("#inputCouponValue").val();
		var couponCount=$("#inputCouponCount").val();
		if(yearStart!="" && yearEnd!="" && hosCode!="" && couponCount!="" && !isNaN(couponCount)){
			couponCount=parseInt(couponCount);
			var startCode=yearStart.substring(2,4)+yearEnd.substring(2,4)+hosCode+"1".paddingLeft("0000000");
			var endCode=yearStart.substring(2,4)+yearEnd.substring(2,4)+hosCode+(""+couponCount).paddingLeft("0000000");
			$("#inputCouponCodeStart").val(startCode);
			$("#inputCouponCodeEnd").val(endCode);
		}
		if(couponCount!="" && !isNaN(couponCount) && couponValue!=""){
			couponCount=parseInt(couponCount);
			$("#inputCouponTotalValue").val(parseFloat(couponCount*couponValue).formatMoney(2,'.',','));			
		}
	};
	$(function(){
		$("#inputCouponCount").keyup(function(){
			calCouponFunction();
		});
		$("#inputYearStart, #inputYearEnd, #inputHospitalCode, #inputCouponValue").change(function(){
			calCouponFunction();
		});
	});
}
//end coupon-add

//coupon-use
function couponRemoveInputCouponUse(button){
	var elem=$(button).closest('div.control-group');
	$(elem).remove();
	$(".div-input-serial:last").addClass('last');
	if($("input[name='inputReceiptId[]']").size()==1){
		$(".btn-admin-remove-input-serial").addClass('hide');
	}
}
function couponInitCouponUseInputReceiptId(elem){	
	elem.keypress(function(e){
		if(e.which!=13) return;
		
		var parentElem=$(elem).closest('div.control-group');
		parentElem.find('.help-block').html('');
		parentElem.find('.help-inline').html('');
		parentElem.removeClass('error');

		var serial=$(elem).val();
		if(serial==''){
			updateInputErrMsg("กรุณาใส่เลขใบเสร็จ",elem);
		}
		else{
			parentElem.find("input[name='inputCouponCodeStart[]']").focus();
	  }
	});
}
function couponInitCouponUseInputCouponCodeStart(elem){	
	elem.keypress(function(e){
		if(e.which!=13) return;

		var parentElem=$(elem).closest('div.control-group');
		parentElem.find('.help-block').html('');
		parentElem.find('.help-inline').html('');
		parentElem.removeClass('error');

		var serial=$(elem).val();
		if(serial==''){
			updateInputErrMsg("กรุณาใส่รหัสคูปอง",elem);
		}
		else{
			var countExist=0;			
			$("input[name^=inputCouponCodeStart]").not($("input[name^=inputCouponCodeStart]",parentElem)).each(function(){
				if($(this).val()==serial) countExist++;
			});	
			$("input[name^=inputCouponCodeEnd]").not($("input[name^=inputCouponCodeEnd]",parentElem)).each(function(){
				if($(this).val()==serial) countExist++;
			});
			if(countExist>1){
				updateInputErrMsg("รหัสคูปองนี้ถูกป้อนในแถวบนแล้ว",elem);
				return;
			}
			parentElem.find("input[name='inputCouponCodeEnd[]']").focus();
			// $.ajax({
			//   type: 'POST',
			//   url: ajaxGetCashCardFromSerialUrl,
			//   data: {"serial":serial},
		 //  	beforeSend: showPageLoading,
			//   success: function(data) {
			//   	if(data!=null){
			//   		updateInputErrMsg("พบบัตร "+serial+" อยู่แล้วในระบบ",elem);
			//   		$(elem).val('');
			//   	}
			//   	else{
			//   		var parentElem=$(elem).closest('div.control-group');
			// 			parentElem.find('.help-block').html('');
			// 			parentElem.find('.help-inline').html('');
			// 			parentElem.find('.control-group').removeClass('error');
			//   		if(parentElem.hasClass('last')){
			// 	  		var controlGroupClone=parentElem.clone();
			// 	  		controlGroupClone.find('input').val('');
			// 	  		parentElem.after(controlGroupClone);
			// 	  		parentElem.removeClass('last');
			// 	  		controlGroupClone.addClass('last');				  		
			// 	  		$(".btn-admin-remove-input-serial").removeClass('hide');
			// 	  		adminInitCashCardSerialInput(controlGroupClone.find("input[name='inputCashCardSerial[]']"));
			// 	  		controlGroupClone.find("input[name='inputCashCardSerial[]']").focus();
			// 	  	}
			//   	}
			// 	},
			//   dataType: "json",
		 //  	complete: hidePageLoading
			// });
		}
	});
}
function couponInitCouponUseInputCouponCodeEnd(elem){	
	elem.keypress(function(e){
		if(e.which!=13) return;

		var parentElem=$(elem).closest('div.control-group');
		parentElem.find('.help-block').html('');
		parentElem.find('.help-inline').html('');
		parentElem.removeClass('error');

		var serial=$(elem).val();
		if(serial==''){
			updateInputErrMsg("กรุณาใส่รหัสคูปอง",elem);
		}
		else{
			var countExist=0;			
			$("input[name^=inputCouponCodeStart]").not($("input[name^=inputCouponCodeStart]",parentElem)).each(function(){
				if($(this).val()==serial) countExist++;
			});	
			$("input[name^=inputCouponCodeEnd]").not($("input[name^=inputCouponCodeEnd]",parentElem)).each(function(){
				if($(this).val()==serial) countExist++;
			});
			if(countExist>1){
				updateInputErrMsg("รหัสคูปองนี้ถูกป้อนในแถวบนแล้ว",elem);
				return;
			}

			if(parentElem.hasClass('last')){
	  		var controlGroupClone=parentElem.clone();
	  		controlGroupClone.find('input').val('');
	  		parentElem.after(controlGroupClone);
	  		parentElem.removeClass('last');
	  		controlGroupClone.addClass('last');				  		
	  		$(".btn-admin-remove-input-serial").removeClass('hide');
	  		couponInitCouponUseInputCouponCodeStart(controlGroupClone.find("input[name='inputCouponCodeStart[]']"));
	  		couponInitCouponUseInputCouponCodeEnd(controlGroupClone.find("input[name='inputCouponCodeEnd[]']"));
	  		couponInitCouponUseInputReceiptId(controlGroupClone.find("input[name='inputReceiptId[]']"));
	  		controlGroupClone.find("input[name='inputReceiptId[]']").focus();
	  	}
	  	else{
	  		var controlGroupClone=parentElem.next('div.control-group');
	  		controlGroupClone.find("input[name='inputReceiptId[]']").focus();
	  	}
			// $.ajax({
			//   type: 'POST',
			//   url: ajaxGetCashCardFromSerialUrl,
			//   data: {"serial":serial},
		 //  	beforeSend: showPageLoading,
			//   success: function(data) {
			//   	if(data!=null){
			//   		updateInputErrMsg("พบบัตร "+serial+" อยู่แล้วในระบบ",elem);
			//   		$(elem).val('');
			//   	}
			//   	else{
			//   		var parentElem=$(elem).closest('div.control-group');
			// 			parentElem.find('.help-block').html('');
			// 			parentElem.find('.help-inline').html('');
			// 			parentElem.find('.control-group').removeClass('error');
			//   		if(parentElem.hasClass('last')){
			// 	  		var controlGroupClone=parentElem.clone();
			// 	  		controlGroupClone.find('input').val('');
			// 	  		parentElem.after(controlGroupClone);
			// 	  		parentElem.removeClass('last');
			// 	  		controlGroupClone.addClass('last');				  		
			// 	  		$(".btn-admin-remove-input-serial").removeClass('hide');
			// 	  		adminInitCashCardSerialInput(controlGroupClone.find("input[name='inputCashCardSerial[]']"));
			// 	  		controlGroupClone.find("input[name='inputCashCardSerial[]']").focus();
			// 	  	}
			//   	}
			// 	},
			//   dataType: "json",
		 //  	complete: hidePageLoading
			// });
		}
	});
}
function validateAdminCouponUseForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputCouponDetail]")) && passValidate;

	return passValidate;
}
if(viewName=="coupon-use"){
	couponInitCouponUseInputCouponCodeStart($("input[name='inputCouponCodeStart[]']"));
	couponInitCouponUseInputCouponCodeEnd($("input[name='inputCouponCodeEnd[]']"));
	couponInitCouponUseInputReceiptId($("input[name='inputReceiptId[]']"));
}
//end coupon-use

//coupon
if(viewName=="coupon-index"){
	$(document).ready(function() {
		bpkDataTable=$('#coupon-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.coupon_code.paddingLeft("000000");
					}
				},
	            { 	"mData" : null, "sClass": "right",
					"mRender": function ( data, type, full ) {
						return parseFloat(full.coupon_value).formatMoney(2,'.',',');
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.receipt_id;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.create_date;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.use_date;
					}
				}
	        ],
	        "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
	      aoData.push( { "name": "create_date_start", "value": $("#inputCreateDateStart").val() } );
	      aoData.push( { "name": "create_date_end", "value": $("#inputCreateDateEnd").val() } );
	      aoData.push( { "name": "use_date_start", "value": $("#inputUseDateStart").val() } );
	      aoData.push( { "name": "use_date_end", "value": $("#inputUseDateEnd").val() } );
	      aoData.push( { "name": "coupon_code_start", "value": $("#inputCouponCodeStart").val() } );
	      aoData.push( { "name": "coupon_code_end", "value": $("#inputCouponCodeEnd").val() } );
	      aoData.push( { "name": "receipt_id", "value": $("#inputReceiptId").val() } );
	      aoData.push( { "name": "coupon_value", "value": $("#inputCouponValue").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-coupon-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	});
}
//end coupon


//document-index
function addDocToFavorite(docId,dataTable){
	showPageLoading();
	$.post(addDocToFavoriteUrl, {"document_id":docId}, function(data) {
		if(data.success=="OK"){
			openModal("success","เอกสารถูกเพิ่มในรายการ Favorite เรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function removeDocFromFavorite(docId,dataTable){
	showPageLoading();
	$.post(removeDocFromFavoriteUrl, {"document_id":docId}, function(data) {
		if(data.success=="OK"){
			openModal("success","เอกสารถูกเอาออกจากรายการ Favorite เรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
if(viewName=="document-index"){
	$(document).ready(function() {
		bpkDataTable=$('#document-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
        { 	"mData" : null, "sClass": "right" },
        { 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
					return full.document_id;
				}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.document_type_detail;
				} 
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.document_name;
				} 
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.file_name;
				} 
				},
				{ 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
				return (full.file_size/1024/1024).formatMoney(2,'.',',');
				} 
				},
				{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
				return full.upload_date;
				}
				},
	      { "mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						var returnHtml="";
						returnHtml+='<a href="'+documentViewUrl+'/'+full.document_id+'" target="_blank" class="btn btn-primary margin-right3" rel="tooltip" data-title="Preview"><i class="icon-eye-open icon-white"></i></a>';
						if(full.view_only=='T'){
		        	returnHtml+='<button class="btn btn-info margin-right3 disabled" rel="tooltip" data-title="Print"><i class="icon-print icon-white"></i></button>'
        								+'<button class="btn btn-info margin-right3 disabled" rel="tooltip" data-title="Download"><i class="icon-download icon-white"></i></button>';
        		}
        		else{
        			if(full.disable_print=='T'){
		        		returnHtml+='<button class="btn btn-info margin-right3 disabled" rel="tooltip" data-title="Print"><i class="icon-print icon-white"></i></button>'
        								+'<a href="'+documentDownloadUrl+'/'+full.document_id+'" target="_blank" class="btn btn-success margin-right3" rel="tooltip" data-title="Download"><i class="icon-download icon-white"></i></a>';
        			}
        			else{
			        	returnHtml+='<a href="'+documentPrintUrl+'/'+full.document_id+'" target="_blank" class="btn btn-danger margin-right3" rel="tooltip" data-title="Print"><i class="icon-print icon-white"></i></a>'
	        								+'<a href="'+documentDownloadUrl+'/'+full.document_id+'" target="_blank" class="btn btn-success margin-right3" rel="tooltip" data-title="Download"><i class="icon-download icon-white"></i></a>';
	        		}
        		}
							returnHtml+='<div class="btn-group">'
			            		+'<a class="btn-more btn btn-info dropdown-toggle" data-toggle="dropdown" href="#">'
			            		+'	More'
			            		+'	<span class="caret"></span>'
			            		+'</a>'
			            		+'<ul class="dropdown-menu">'
			            		+'	<li>';
			            if(full.is_fav==1){
			            	returnHtml+='<a href="#" onclick="removeDocFromFavorite(\''+full.document_id+'\',$(\'#document-datatable\')); return false;"><span>เอาออกจาก Favorite</span></a>';
			            }
			            else{
			            	returnHtml+='<a href="#" onclick="addDocToFavorite(\''+full.document_id+'\',$(\'#document-datatable\')); return false;"><span>เพิ่มใน Favorite</span></a>';
			            }
			            returnHtml+='</li>';
			            returnHtml+='<li><a target="_blank" href="'+seeRefDocumentUrl+'/'+full.document_id+'"><span>ดูเอกสารอ้างอิง</span></a></li>'
			            if(full.upload_by_emp_id==userEmpId){
			            	returnHtml+='<li><a target="_blank" href="'+documentEditUrl+'/'+full.document_id+'"><span>แก้ไข</span></a></li>'
			            }
			            		+'</ul>'
			            	+'</div>';
			            return returnHtml;
					}
				}
	     ],
	    "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
	      aoData.push( { "name": "document_id", "value": $("#inputDocumentId").val() } );
	      aoData.push( { "name": "document_type_id", "value": $("#inputDocumentTypeId").val() } );
	      aoData.push( { "name": "document_name", "value": $("#inputDocumentName").val() } );
	      aoData.push( { "name": "file_name", "value": $("#inputFileName").val() } ); 
	      aoData.push( { "name": "upload_date_start", "value": $("#inputDocumentUploadStart").val() } );
	      aoData.push( { "name": "upload_date_end", "value": $("#inputDocumentUploadEnd").val() } );
	      aoData.push( { "name": "view_type", "value": $("#inputViewType").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-document-submit").click(function(){
			bpkDataTableSearchSubmit(bpkDataTable);
			return false;
		});
	});
}
//end document-index


//document-ref
if(viewName=="document-ref"){
	$(document).ready(function() {
		bpkDataTable=$('#document-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
        { 	"mData" : null, "sClass": "right" },
        { 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
					return full.document_id;
				}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.document_name;
				} 
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.file_name;
				} 
				},
				{ 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
				return (full.file_size/1024/1024).formatMoney(2,'.',',');
				} 
				},
				{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
				return full.upload_date;
				}
				},
	      { "mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						var returnHtml="";
						returnHtml+='<a href="'+documentViewUrl+'/'+full.document_id+'" target="_blank" class="btn btn-primary margin-right3" rel="tooltip" data-title="Preview"><i class="icon-eye-open icon-white"></i></a>';
						if(full.view_only!='T'){
		        	returnHtml+='<a href="'+documentPrintUrl+'/'+full.document_id+'" target="_blank" class="btn btn-danger margin-right3" rel="tooltip" data-title="Print"><i class="icon-print icon-white"></i></a>'
        								+'<a href="'+documentDownloadUrl+'/'+full.document_id+'" target="_blank" class="btn btn-success margin-right3" rel="tooltip" data-title="Download"><i class="icon-download icon-white"></i></a>';
        		}
        		else{
		        	returnHtml+='<button class="btn btn-info margin-right3 disabled" rel="tooltip" data-title="Print"><i class="icon-print icon-white"></i></button>'
        								+'<button class="btn btn-info margin-right3 disabled" rel="tooltip" data-title="Download"><i class="icon-download icon-white"></i></button>';
        		}
        		returnHtml+= '<div class="btn-group">'
			            		+'<a class="btn-more btn btn-info dropdown-toggle" data-toggle="dropdown" href="#">'
			            		+'	More'
			            		+'	<span class="caret"></span>'
			            		+'</a>'
			            		+'<ul class="dropdown-menu">'
			            		+'	<li>';
			            if(full.is_fav==1){
			            	returnHtml+='<a href="#" onclick="removeDocFromFavorite(\''+full.document_id+'\',$(\'#document-datatable\')); return false;"><span>เอาออกจาก Favorite</span></a>';
			            }
			            else{
			            	returnHtml+='<a href="#" onclick="addDocToFavorite(\''+full.document_id+'\',$(\'#document-datatable\')); return false;"><span>เพิ่มใน Favorite</span></a>';
			            }
			            returnHtml+='</li>';
			            returnHtml+='<li><a target="_blank" href="'+seeRefDocumentUrl+'/'+full.document_id+'"><span>ดูเอกสารอ้างอิง</span></a></li>'
			            		+'</ul>'
			            	+'</div>';
			            return returnHtml;
					}
				}
	     ],
	    "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
	      aoData.push( { "name": "document_id", "value": $("#inputDocumentId").val() } );
	      aoData.push( { "name": "document_name", "value": $("#inputDocumentName").val() } );
	      aoData.push( { "name": "file_name", "value": $("#inputFileName").val() } ); 
	      aoData.push( { "name": "upload_date_start", "value": $("#inputDocumentUploadStart").val() } );
	      aoData.push( { "name": "upload_date_end", "value": $("#inputDocumentUploadEnd").val() } );
	      aoData.push( { "name": "for_document_id", "value": seeRefDocForDocId } );

			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-document-submit").click(function(){
			bpkDataTableSearchSubmit(bpkDataTable);
			return false;
		});
	});
}
//end document-ref



//news-add
function validateNewsAddForm(){
	var passValidate=true;
	//check input bottom up
	// passValidate=checkInputTypeText($("textarea[name=inputContent]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputNewsName]")) && passValidate;
	passValidate=checkInputTypeSelect($("#inputNewsTypeId")) && passValidate;

	return passValidate;
}
if(viewName=="news-add"){
}
//end news-add
//news-edit
function validateNewsEditForm(){
	var passValidate=true;
	//check input bottom up
	// passValidate=checkInputTypeText($("textarea[name=inputContent]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputNewsName]")) && passValidate;
	passValidate=checkInputTypeSelect($("#inputNewsTypeId")) && passValidate;

	return passValidate;
}
if(viewName=="news-edit"){
}
//end news-edit
//news-index
function enableNews(news_id,dataTable){
	showPageLoading();
	$.post(newsEnableUrl, {"news_id":news_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ข่าวสารที่เลือกถูกเปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function disableNews(news_id,dataTable){
	showPageLoading();
	$.post(newsDisableUrl, {"news_id":news_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ข่าวสารที่เลือกถูกปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function deleteNews(news_id,news_name,dataTable){
	openModal("ยืนยันการลบ","ยืนยันการลบข่าวสาร "+news_name+"?",true,function(){
		showPageLoading();
		$.post(newsDeleteUrl, {"news_id":news_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","ข่าวสารถูกลบเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
if(viewName=="news-index"){
	$(document).ready(function() {
		bpkDataTable=$('#news-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
        { 	"mData" : null, "sClass": "right" },
        { 	"mData" : null, "sClass": "left",
				"mRender": function ( data, type, full ) {
					return '<a target="_blank" href="'+newsViewUrl+'/'+full.news_id+'">'+full.news_id+'</a>'+(full.is_read=="0"?'<small>(Unread)</small>':'');
				}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.news_type_detail;
				} 
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.news_name;
				} 
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.create_by_emp_name;
				} 
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.section_detail;
				} 
				},
				{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
				return full.create_date;
				}
				},
	      { "mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						var returnHtml="";						
							returnHtml+='<div class="btn-group">'
			            		+'<a class="btn-more btn btn-info dropdown-toggle" data-toggle="dropdown" href="#">'
			            		+'	More'
			            		+'	<span class="caret"></span>'
			            		+'</a>'
			            		+'<ul class="dropdown-menu">'
			            returnHtml+='<li><a target="_blank" href="'+newsViewUrl+'/'+full.news_id+'"><span>View</span></a></li>'
			            if(full.disable_print=='F'){
				            returnHtml+='<li><a target="_blank" href="'+newsPrintUrl+'/'+full.news_id+'"><span>Print</span></a></li>'
				          }
			            if(full.create_by==userEmpId || (inJSONArray("NEWS_SECTION_ADMIN",session_app_permission_include) != -1) && full.section_id==userSectionId){
			            	returnHtml+='<li><a target="_blank" href="'+newsEditUrl+'/'+full.news_id+'"><span>แก้ไข</span></a></li>'
			            	returnHtml+='<li><a href="#" onclick="deleteNews(\''+full.news_id+'\',\''+full.news_name.replace(/'/g,'')+'\',$(\'#news-datatable\')); return false;"><span>ลบ</span></a>';
			            }
			            		+'</ul>'
			            	+'</div>';
			            return returnHtml;
					}
				}
	     ],
	    "aaSorting": [[ 6, "desc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
	      aoData.push( { "name": "news_id", "value": $("#inputNewsId").val() } );
	      aoData.push( { "name": "news_type_id", "value": $("#inputNewsTypeId").val() } );
	      aoData.push( { "name": "news_name", "value": $("#inputNewsName").val() } );
	      aoData.push( { "name": "create_date_start", "value": $("#inputNewsCreateStart").val() } );
	      aoData.push( { "name": "create_date_end", "value": $("#inputNewsCreateEnd").val() } );
	      aoData.push( { "name": "create_by_emp_name", "value": $("#inputCreateByEmp").val() } );
	      aoData.push( { "name": "view_type", "value": $("#inputViewType").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-news-submit").click(function(){
			bpkDataTableSearchSubmit(bpkDataTable);
			return false;
		});
	});
}
//end news-index


//home-index
var bpkDataTable_News;
function selectNewsType(elem, news_type_id){
	refreshComboBox($("#inputNewsTypeId"),news_type_id);
	bpkDataTableSearchSubmit(bpkDataTable_News);

	$("#section-news .accordion-inner").removeClass('selected');
	$(elem).closest(".accordion-inner").addClass('selected');
}
function editProjectTrackTag(){
	showPageLoading();
	var project_track_id=$("#projectTrackEditTagModal #inputProjectTrackId").val();
	var tag=$("#projectTrackEditTagModal #inputProjectTrackTag").val();
	$.post(projectTrackEditTagUrl, {"project_track_id":project_track_id, "tag":tag}, function(data) {
		if(data.success=="OK"){
			bpkDataTableSearchSubmit($('#project-track-datatable'));
			$('#projectTrackEditTagModal').modal('hide');
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function openEditProjectTrackTag(project_track_id){
	$("#projectTrackEditTagModal #inputProjectTrackId").val(project_track_id);
	$("#projectTrackEditTagModal #inputProjectTrackTag").val('');
	$('#projectTrackEditTagModal').modal({ dynamic: true, backdrop: true });
	setTimeout(function(){
		$('#projectTrackEditTagModal').focus(); // add to fix bug on chrome when press esc
	},300);
}
if(viewName=="home-index"){
	var projectCalendar=null;
	$(document).ready(function() {
		var bpkDataTable_FavDoc=$('#fav-doc-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
        { 	"mData" : null, "sClass": "right" },
        { 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
					return full.document_id;
				}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.document_type_detail;
				} 
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.document_name;
				} 
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.file_name;
				} 
				},
				{ 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
				return (full.file_size/1024/1024).formatMoney(2,'.',',');
				} 
				},
				{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
				return full.upload_date;
				}
				},
	      { "mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						var returnHtml="";
						returnHtml+='<a href="'+documentViewUrl+'/'+full.document_id+'" target="_blank" class="btn btn-primary margin-right3" rel="tooltip" data-title="Preview"><i class="icon-eye-open icon-white"></i></a>';
						if(full.view_only!='T'){
		        	returnHtml+='<a href="'+documentPrintUrl+'/'+full.document_id+'" target="_blank" class="btn btn-danger margin-right3" rel="tooltip" data-title="Print"><i class="icon-print icon-white"></i></a>'
        								+'<a href="'+documentDownloadUrl+'/'+full.document_id+'" target="_blank" class="btn btn-success margin-right3" rel="tooltip" data-title="Download"><i class="icon-download icon-white"></i></a>';
        		}
        		else{
		        	returnHtml+='<button class="btn btn-info margin-right3 disabled" rel="tooltip" data-title="Print"><i class="icon-print icon-white"></i></button>'
        								+'<button class="btn btn-info margin-right3 disabled" rel="tooltip" data-title="Download"><i class="icon-download icon-white"></i></button>';
        		}
						returnHtml+='<div class="btn-group">'
			            		+'<a class="btn-more btn btn-info dropdown-toggle" data-toggle="dropdown" href="#">'
			            		+'	More'
			            		+'	<span class="caret"></span>'
			            		+'</a>'
			            		+'<ul class="dropdown-menu">'
			            		+'	<li>';
			            if(full.is_fav==1){
			            	returnHtml+='<a href="#" onclick="removeDocFromFavorite(\''+full.document_id+'\',$(\'#fav-doc-datatable\')); return false;"><span>เอาออกจาก Favorite</span></a>';
			            }
			            else{
			            	returnHtml+='<a href="#" onclick="addDocToFavorite(\''+full.document_id+'\',$(\'#fav-doc-datatable\')); return false;"><span>เพิ่มใน Favorite</span></a>';
			            }
			            returnHtml+='</li>';
			            returnHtml+='<li><a target="_blank" href="'+seeRefDocumentUrl+'/'+full.document_id+'"><span>ดูเอกสารอ้างอิง</span></a></li>'
			            		+'</ul>'
			            	+'</div>';
			            return returnHtml;
					}
				}
	     ],
	    "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl_FavDoc,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
	      aoData.push( { "name": "document_id", "value": $("#inputDocumentId").val() } );
	      aoData.push( { "name": "document_type_id", "value": $("#inputDocumentTypeId").val() } );
	      aoData.push( { "name": "document_name", "value": $("#inputDocumentName").val() } );
	      aoData.push( { "name": "file_name", "value": $("#inputFileName").val() } ); 
	      aoData.push( { "name": "upload_date_start", "value": $("#inputDocumentUploadStart").val() } );
	      aoData.push( { "name": "upload_date_end", "value": $("#inputDocumentUploadEnd").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable_FavDoc.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-fav-doc-submit").click(function(){
			bpkDataTableSearchSubmit(bpkDataTable_FavDoc);
			return false;
		});


		//Table News
		bpkDataTable_News=$('#news-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
        { 	"mData" : null, "sClass": "right" },
        { 	"mData" : null, "sClass": "left",
				"mRender": function ( data, type, full ) {
					return '<a target="_blank" href="'+newsViewUrl+'/'+full.news_id+'">'+full.news_id+'</a>'+(full.is_read=="0"?'<small>(Unread)</small>':'');
				}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.news_type_detail;
				} 
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.news_name;
				} 
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.create_by_emp_name;
				} 
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.section_detail;
				}
				},
				{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
				return full.create_date;
				}
				}
	     ],
	    "aaSorting": [[ 6, "desc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl_News,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
	      aoData.push( { "name": "news_id", "value": $("#inputNewsId").val() } );
	      aoData.push( { "name": "news_type_id", "value": $("#inputNewsTypeId").val() } );
	      aoData.push( { "name": "news_name", "value": $("#inputNewsName").val() } );
	      aoData.push( { "name": "create_date_start", "value": $("#inputNewsCreateStart").val() } );
	      aoData.push( { "name": "create_date_end", "value": $("#inputNewsCreateEnd").val() } );
	      aoData.push( { "name": "create_by_emp_name", "value": $("#inputCreateByEmp").val() } );
	      aoData.push( { "name": "view_type", "value": '' } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable_News.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-news-submit").click(function(){
			bpkDataTableSearchSubmit(bpkDataTable_News);
			return false;
		});


		//Table Task		
		var bpkDataTableTask=$('#task-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	      { 	"mData" : null, "sClass": "right" },
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.task_id;
					}
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.task_title;
					} 
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.task_status_detail;
					} 
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						if(full.plan_start_date==null){
							return "";
						}
						return full.plan_start_date+" ถึง "+(full.plan_end_date==null?'-':full.plan_end_date);
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.create_date;
					}
				},
	      { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+taskViewUrl+'/'+full.task_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="icon-search icon-white"></i></a>';
					}
				},
	      { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.attachment_count>0){
							return '<i class="icon-file"></i>';
						}
						else{
							return '';
						}
					}
				}
	    ],
	    "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl_Task,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
			      // aoData.push( { "name": "unfinished", "value": "true" } );
			      // aoData.push( { "name": "project_id", "value": $("#inputProjectId_Project").val() } );
			      // aoData.push( { "name": "title", "value": $("#inputTitle_Project").val() } );
			      // aoData.push( { "name": "request_type_id", "value": $("#inputRequestType_Project").val() } );
			      // aoData.push( { "name": "section_detail", "value": $("#inputSectionDetail_Project").val() } );
			      // aoData.push( { "name": "request_priority_id", "value": $("#inputRequestPriority_Project").val() } );
			      // aoData.push( { "name": "project_status_id", "value": $("#inputProjectStatus_Project").val() } );
			      // aoData.push( { "name": "inform_date_start", "value": $("#inputInformDateStart_Project").val() } );
			      // aoData.push( { "name": "inform_date_end", "value": $("#inputInformDateEnd_Project").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTableTask.dataTable().fnSetFilteringDelay(sSearchDelay);

		// $("#table-project-submit").click(function(){
		// 	bpkDataTableSearchSubmit(bpkDataTableProject);
		// 	return false;
		// });


		//Table Project		
		var bpkDataTableProject=$('#project-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	      { 	"mData" : null, "sClass": "right" },
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.project_id;
					}
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.title;
					} 
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.request_type_detail;
					} 
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.inform_section_detail;
					}
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.accept_section_detail;
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.request_priority_id=="0"){
							return '<span class="label label-important">'+full.request_priority_detail+'</span>';
						}
						else{
							return '<span class="label label-info">'+full.request_priority_detail+'</span>';
						}						
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.inform_date;
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.project_status_detail;
					}
				},
	      { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+projectViewUrl+'/'+full.project_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="icon-search icon-white"></i></a>';
					}
				}
	    ],
	    "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl_Project,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
			      aoData.push( { "name": "unfinished", "value": "true" } );
			      aoData.push( { "name": "project_id", "value": $("#inputProjectId_Project").val() } );
			      aoData.push( { "name": "title", "value": $("#inputTitle_Project").val() } );
			      aoData.push( { "name": "request_type_id", "value": $("#inputRequestType_Project").val() } );
			      aoData.push( { "name": "inform_section_id", "value": $("#inputInformSectionId_Project").val() } );
			      aoData.push( { "name": "accept_section_id", "value": $("#inputAcceptSectionId_Project").val() } );
			      aoData.push( { "name": "request_priority_id", "value": $("#inputRequestPriority_Project").val() } );
			      aoData.push( { "name": "project_status_id", "value": $("#inputProjectStatus_Project").val() } );
			      aoData.push( { "name": "inform_date_start", "value": $("#inputInformDateStart_Project").val() } );
			      aoData.push( { "name": "inform_date_end", "value": $("#inputInformDateEnd_Project").val() } );
			      aoData.push( { "name": "view_type", "value": $("#inputProjectViewType_Project").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTableProject.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-project-submit").click(function(){
			bpkDataTableSearchSubmit(bpkDataTableProject);
			return false;
		});

		$("#inputProjectViewType_Project").change(function(){
			bpkDataTableSearchSubmit(bpkDataTableProject);
		});

		//Table Project Incharge
		var bpkDataTableProject=$('#project-incharge-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	      { 	"mData" : null, "sClass": "right" },
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.project_id;
					}
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.title;
					} 
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.request_type_detail;
					} 
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.inform_section_detail;
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.request_priority_id=="0"){
							return '<span class="label label-important">'+full.request_priority_detail+'</span>';
						}
						else{
							return '<span class="label label-info">'+full.request_priority_detail+'</span>';
						}						
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.inform_date;
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.accept_inform_date;
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.project_status_id=='2'){
							return full.project_status_detail+' ('+(full.incomplete_task==0?'<i class="icon-ok"></i>':'<i class="icon-remove"></i>')+')';
						}
						else{
							return full.project_status_detail;
						}
					}
				},
	      { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+projectViewUrl+'/'+full.project_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="icon-search icon-white"></i></a>';
					}
				}
	    ],
	    "aaSorting": [[ 7, "desc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl_ProjectIncharge,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
			      aoData.push( { "name": "unfinished", "value": "true" } );
			      aoData.push( { "name": "project_id", "value": $("#inputProjectId_Project").val() } );
			      aoData.push( { "name": "title", "value": $("#inputTitle_Project").val() } );
			      aoData.push( { "name": "request_type_id", "value": $("#inputRequestType_Project").val() } );
			      aoData.push( { "name": "inform_section_id", "value": $("#inputInformSectionId_Project").val() } );
			      aoData.push( { "name": "accept_section_id", "value": $("#inputAcceptSectionId_Project").val() } );
			      aoData.push( { "name": "request_priority_id", "value": $("#inputRequestPriority_Project").val() } );
			      aoData.push( { "name": "project_status_id", "value": $("#inputProjectStatus_Project").val() } );
			      aoData.push( { "name": "inform_date_start", "value": $("#inputInformDateStart_Project").val() } );
			      aoData.push( { "name": "inform_date_end", "value": $("#inputInformDateEnd_Project").val() } );
			      aoData.push( { "name": "view_type", "value": $("#inputProjectViewType_Project").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTableProject.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-project-submit").click(function(){
			bpkDataTableSearchSubmit(bpkDataTableProject);
			return false;
		});

		//Table Project Inform
		var bpkDataTableProjectInform=$('#project-inform-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	      { 	"mData" : null, "sClass": "right" },
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.project_id;
					}
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.title;
					} 
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.request_type_detail;
					} 
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.accept_section_detail;
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.request_priority_id=="0"){
							return '<span class="label label-important">'+full.request_priority_detail+'</span>';
						}
						else{
							return '<span class="label label-info">'+full.request_priority_detail+'</span>';
						}						
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.inform_date;
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.accept_inform_date;
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.project_status_detail;
					}
				},
	      { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+projectViewUrl+'/'+full.project_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="icon-search icon-white"></i></a>';
					}
				}
	    ],
	    "aaSorting": [[ 6, "desc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl_ProjectInform,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
			      aoData.push( { "name": "unfinished", "value": "true" } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTableProjectInform.dataTable().fnSetFilteringDelay(sSearchDelay);


		//Table Waiting Approve		
		var bpkDataTableWaitingApprove=$('#waiting-approve-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	      { 	"mData" : null, "sClass": "right" },
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.project_id;
					}
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.title;
					} 
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.request_type_detail;
					} 
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.inform_section_detail;
					}
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.accept_section_detail;
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.request_priority_id=="0"){
							return '<span class="label label-important">'+full.request_priority_detail+'</span>';
						}
						else{
							return '<span class="label label-info">'+full.request_priority_detail+'</span>';
						}						
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.inform_date;
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.project_status_detail;
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+projectViewUrl+'/'+full.project_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="icon-search icon-white"></i></a>';
					}
				}
	    ],
	    "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl_WaitingApprove,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
			  aoData.push( { "name": "view_type", "value": $("#inputProjectViewType_WaitingApproveProject").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTableWaitingApprove.dataTable().fnSetFilteringDelay(sSearchDelay);
		
		$("#inputProjectViewType_WaitingApproveProject").change(function(){
			bpkDataTableSearchSubmit(bpkDataTableWaitingApprove);
		});


		//Table Project Track		
		var bpkDataTableProjectTrack=$('#project-track-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	      { 	"mData" : null, "sClass": "right" },
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.project_id;
					}
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.title;
					} 
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.request_type_detail;
					} 
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.inform_section_detail;
					}
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.accept_section_detail;
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.inform_date;
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.project_status_detail;
					}
				},
	      { 	"mData" : null, "sClass": "left",
					"mRender": function ( data, type, full ) {
						return full.tag;
					}
				},
	      { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+projectViewUrl+'/'+full.project_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="icon-search icon-white"></i></a>';
					}
				},
	      { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<button onclick="openEditProjectTrackTag(\''+full.project_track_id+'\',$(\'#project-track-datatable\'));" class="btn" rel="tooltip" data-title="Edit Tag">Tag</button>';
					}
				}
	    ],
	    "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl_ProjectTrack,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
			      aoData.push( { "name": "unfinished", "value": "true" } );
			      aoData.push( { "name": "project_id", "value": $("#inputProjectId_Project").val() } );
			      aoData.push( { "name": "title", "value": $("#inputTitle_Project").val() } );
			      aoData.push( { "name": "request_type_id", "value": $("#inputRequestType_Project").val() } );
			      aoData.push( { "name": "inform_section_id", "value": $("#inputInformSectionId_Project").val() } );
			      aoData.push( { "name": "accept_section_id", "value": $("#inputAcceptSectionId_Project").val() } );
			      aoData.push( { "name": "project_status_id", "value": $("#inputProjectStatus_Project").val() } );
			      aoData.push( { "name": "inform_date_start", "value": $("#inputInformDateStart_Project").val() } );
			      aoData.push( { "name": "inform_date_end", "value": $("#inputInformDateEnd_Project").val() } );
			      aoData.push( { "name": "request_priority_id", "value": $("#inputRequestPriority_Project").val() } );
			      aoData.push( { "name": "view_type", "value": $("#inputProjectViewType_Project").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTableProjectTrack.dataTable().fnSetFilteringDelay(sSearchDelay);

	});

	var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();

	var alreadyInitCalendar=false;

	projectCalendar=$('#calendar').fullCalendar({
		theme: true,
		header: {
			left: 'prev,next today',
			center: 'title',
			right: 'month,agendaWeek,agendaDay'
		},
		height: 450,
		editable: false,
		events:function (start,end,callback){			
			if(!alreadyInitCalendar){
				$("#section-calendar").addClass('tab-pane');
				alreadyInitCalendar=true;
				return;
			}
			else{				
				showPageLoading();
			}
			var emp_id=$("#inputCalendarSelectEmp").val();
			var project_id=$("#inputCalendarSelectProject").val();
			$.post(ajaxProjectCalendarUrl, { "start":ISODateString(start),"end":ISODateString(end)
				,"project_id":project_id
				,"emp_id":emp_id
				,"checkboxPlanToPlan":$("#calendarCheckboxPlanToPlan").is(":checked")
				,"checkboxPlanToFinish":$("#calendarCheckboxPlanToFinish").is(":checked")
				,"checkboxAcceptToFinish":$("#calendarCheckboxAcceptToFinish").is(":checked")}, function(data) {
				callback(data.events);
			},"json").always(function() {
				hidePageLoading();
			});
		},
		eventMouseover: function(event, jsEvent, view) {
		  $('.fc-event-inner', this).append('<div id=\"'+event.id+'\" class=\"hover-end\">งาน '+event.title+' (ใบบันทึก '+event.project_title+')</div>');
		},
		eventMouseout: function(event, jsEvent, view) {
		  $('#'+event.id).remove();
		},
		eventClick: function(event, jsEvent, view) {
			window.open(taskViewUrl+"/"+event.task_id);
    }
	});

	$("#inputCalendarSelectEmp,#inputCalendarSelectProject, #calendarCheckboxPlanToPlan, #calendarCheckboxPlanToFinish, #calendarCheckboxAcceptToFinish").change(function(){
		projectCalendar.fullCalendar('refetchEvents');
	});

	$("#tab-section-calendar").click(function(){
		projectCalendar.fullCalendar('refetchEvents');
	});
}
//end home-index


//est_cost
var oldCheckHn="";
function calEstCostTotalPrice(){
	$("#inputTotalPrice").val(parseFloat(parseFloat($("#inputWardTotal").val()==""?0:$("#inputWardTotal").val().replace(/,/g,''))
		+parseFloat($("#inputICUTotal").val()==""?0:$("#inputICUTotal").val().replace(/,/g,''))
		+parseFloat($("#inputW3Total").val()==""?0:$("#inputW3Total").val().replace(/,/g,''))
		+parseFloat($("#inputAnesTotal").val()==""?0:$("#inputAnesTotal").val().replace(/,/g,''))
		+parseFloat($("#inputOpTotal").val()==""?0:$("#inputOpTotal").val().replace(/,/g,''))
		+parseFloat($("#inputOpRoomTotal").val()==""?0:$("#inputOpRoomTotal").val().replace(/,/g,''))
		+parseFloat($("#inputCheckupTotal").val()==""?0:$("#inputCheckupTotal").val().replace(/,/g,''))).formatMoney(2,'.',','));
}
function calEstCostTotalPriceDrg(){
	$("#inputTotalPriceDrg").val(parseFloat($("#inputDRGTotal").val()==""?0:$("#inputDRGTotal").val().replace(/,/g,''))
		+parseFloat($("#inputDrgW3").val()==""?0:$("#inputDrgW3").val().replace(/,/g,''))
		+parseFloat($("#inputDrgCheckup").val()==""?0:$("#inputDrgCheckup").val().replace(/,/g,'')));
}
function validateEstCostAddForm(){
	var passValidate=true;

	$("input[name=inputPID]").val($.trim($("input[name=inputPID]").val()));
	$("input[name=inputPassportNo]").val($.trim($("input[name=inputPassportNo]").val()));
	$("input[name=inputHN]").val($.trim($("input[name=inputHN]").val()));

	if($("input[name=inputPID]").val()=="" &&  $("input[name=inputPassportNo]").val()=="" &&  $("input[name=inputHN]").val()==""){
		updateInputErrMsg("กรุณาระบุ HN หรือ รหัสบัตรประชาชน หรือ Passport No.",$("input[name=inputPassportNo]"));
		updateInputErrMsg("*",$("input[name=inputPID]"));
		updateInputErrMsg("*",$("input[name=inputHN]"));
		passValidate=false;
	}

	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputLastName]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputFirstName]")) && passValidate;

	if(passValidate){
		$("#estCostForm").submit();
	}
}
function validateEstCostEditForm(){
	var passValidate=true;

	$("input[name=inputPID]").val($.trim($("input[name=inputPID]").val()));
	$("input[name=inputPassportNo]").val($.trim($("input[name=inputPassportNo]").val()));
	$("input[name=inputHN]").val($.trim($("input[name=inputHN]").val()));

	if($("input[name=inputPID]").val()=="" &&  $("input[name=inputPassportNo]").val()=="" &&  $("input[name=inputHN]").val()==""){
		updateInputErrMsg("กรุณาระบุ HN หรือ รหัสบัตรประชาชน หรือ Passport No.",$("input[name=inputPassportNo]"));
		updateInputErrMsg("*",$("input[name=inputPID]"));
		updateInputErrMsg("*",$("input[name=inputHN]"));
		passValidate=false;
	}

	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputLastName]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputFirstName]")) && passValidate;

	if(passValidate){
		$("#estCostForm").submit();
	}
}
function estCostGetPatientByHn(hn){
	$.ajax({
	  type: 'POST',
	  url: ajaxGetPatientByHNUrl,
	  data: {'hn': hn},
	  beforeSend: function(){
	  	$("#div-inputHN span.help-inline").html('กำลังค้นหา HN ในระบบ...');
	  },
	  success: function(data) {
	  	if(data!=null){
	  		$("#div-inputHN span.help-inline").html('พบข้อมูล: '+data.firstname);

	  		var titleName="";
	  		var form=$("#estCostForm");

	  		if(data.prename=="น.ส.") data.prename="นางสาว";
	  		else if(data.prename=="ด.ช.") data.prename="เด็กชาย";
	  		else if(data.prename=="ด.ญ.") data.prename="เด็กหญิง";

				form.find('input[name=inputTitleNameOther]').closest('div.control-group').hide();

				if(data.prename==null || data.prename==""){
					refreshComboBox($("select[id=inputTitleName]",form),"");
				}
				else if($("select[id=inputTitleName] option[value='"+data.prename+"']").size()>0){
					refreshComboBox($("select[id=inputTitleName]",form),data.prename);
					titleName=data.prename;
				}
				else{
					refreshComboBox($("select[id=inputTitleName]",form),"other");
					form.find('input[name=inputTitleNameOther]').closest('div.control-group').show();
					form.find('input[name=inputTitleNameOther]').val(data.prename);
					titleName=data.prename;
				}

				if(data.firstname!=null){
					form.find('input[name=inputFirstName]').val(data.firstname);
				}
				if(data.lastname!=null){
					form.find('input[name=inputLastName]').val(data.lastname);
				}
				if(data.patient_age!=null){
					var indexO=data.patient_age.indexOf(' ');
					if(indexO!=-1){
						data.patient_age=data.patient_age.substring(0,indexO);
					}
					form.find('input[name=inputAge]').val(data.patient_age);
				}
				if(data.bed_number!=null){
					form.find('input[name=inputRoom]').val(data.bed_number);
				}
				if(data.main_symptom!=null){
					form.find('input[name=inputCondition]').val(data.main_symptom);
				}
	  	}
	  	else{
	  		$("#div-inputHN span.help-inline").html('ไม่พบข้อมูล');
	  	}
		},
	  dataType: "json",
	  async:true,	  
    timeout: 10000,
	  complete: function(){
	  },
	  error: function(){	  	
	  	$("#div-inputHN span.help-inline").html('ไม่พบข้อมูล');
	  }
	});	

}
function estCostGetAnesPrice(){	
  if($("#inputDoctorEmpId").val()!="" && $("#inputICD10Code").val()!=""){
  	var doctor_fee_eid=$("#inputDoctorEmpId").val();
  	var icd10_code=$("#inputICD10Code").val();
		$.ajax({
		  type: 'POST',
		  url: ajaxGetImedAnesPriceUrl,
		  data: {'doctor_fee_eid': doctor_fee_eid,'icd10_code': icd10_code},
		  beforeSend: function(){
		  },
		  success: function(data) {
		  	if(data!=null){
		  		$("#inputAnesPrice").val(data.unit_price_sale);
		  		$("#inputDoctorFee").val(data.unit_price_sale);
		  	}
		  	else{
		  	}
			},
		  dataType: "json",
		  async:true,	  
	    timeout: 10000,
		  complete: function(){
		  },
		  error: function(){	  	
		  }
		});	
	}
}
if(viewName=="est_cost-add" || viewName=="est_cost-edit"){
	$("#inputDoctorName").each(function(){
		var elem=$(this);
		elem.typeahead({
			 	updater: function(item) {  
	        if(!typeAheadUpdaterCheck){
	        	typeAheadUpdaterCheck=true;
	        	var item = JSON.parse(item);
		        $("#inputDoctorEmpId").val(item.id);

		        estCostGetAnesPrice();

		        setTimeout(function(){
		        	typeAheadUpdaterCheck=false;
		        },300);
		      }
	        return item;
		    },
		    source: function (query, process) {
		    	var $items = new Array;
        	$items = [""];
		    	return $.ajax({
            url: elem.data('link'),
            type: 'post',
            data: { query: query },
            dataType: 'json',
            success: function (data) {
            	$.map(data, function(data){
                  var group;
                  group = {
                      id: data.id,
                      detail: data.detail,                            
                      toString: function () {
                          return JSON.stringify(this);
                      },
                      toLowerCase: function () {
                          return this.detail.toLowerCase();
                      },
                      indexOf: function (string) {
                          return String.prototype.indexOf.apply(this.detail, arguments);
                      },
                      replace: function (string) {
                          var value = '';
                          value +=  this.detail;
                          return  value;
                      }
                  };
                  $items.push(group);
              });

              process($items);
            }
        });
      }
		});
	});		
	$("#inputICD9").each(function(){
		var elem=$(this);
		elem.typeahead({
			 	updater: function(item) {  
	        if(!typeAheadUpdaterCheck){
	        	typeAheadUpdaterCheck=true;
	        	var item = JSON.parse(item);
		        $("#inputICD9Code").val(item.id);
		        setTimeout(function(){
		        	typeAheadUpdaterCheck=false;
		        },300);
		      }
	        return item;
		    },
		    source: function (query, process) {
		    	var $items = new Array;
        	$items = [""];
		    	return $.ajax({
            url: elem.data('link'),
            type: 'post',
            data: { query: query },
            dataType: 'json',
            success: function (data) {
            	$.map(data, function(data){
                  var group;
                  group = {
                      id: data.id,
                      detail: data.detail,                            
                      toString: function () {
                          return JSON.stringify(this);
                      },
                      toLowerCase: function () {
                          return this.detail.toLowerCase();
                      },
                      indexOf: function (string) {
                          return String.prototype.indexOf.apply(this.detail, arguments);
                      },
                      replace: function (string) {
                          var value = '';
                          value +=  this.detail;
                          return  value;
                      }
                  };
                  $items.push(group);
              });

              process($items);
            }
        });
      }
		});
	});		
	$("#inputICD10").each(function(){
		var elem=$(this);
		elem.typeahead({
			 	updater: function(item) {  
	        if(!typeAheadUpdaterCheck){
	        	typeAheadUpdaterCheck=true;
	        	var item = JSON.parse(item);
		        $("#inputICD10Code").val(item.id);
		        estCostGetAnesPrice();
		        setTimeout(function(){
		        	typeAheadUpdaterCheck=false;
		        },300);
		      }
	        return item;
		    },
		    source: function (query, process) {
		    	var $items = new Array;
        	$items = [""];
		    	return $.ajax({
            url: elem.data('link'),
            type: 'post',
            data: { query: query },
            dataType: 'json',
            success: function (data) {
            	$.map(data, function(data){
                  var group;
                  group = {
                      id: data.id,
                      detail: data.detail,                            
                      toString: function () {
                          return JSON.stringify(this);
                      },
                      toLowerCase: function () {
                          return this.detail.toLowerCase();
                      },
                      indexOf: function (string) {
                          return String.prototype.indexOf.apply(this.detail, arguments);
                      },
                      replace: function (string) {
                          var value = '';
                          value +=  this.detail;
                          return  value;
                      }
                  };
                  $items.push(group);
              });

              process($items);
            }
        });
      }
		});
	});		

	$("#inputWardRoomType").each(function(){
		var elem=$(this);
		elem.typeahead({
			 	updater: function(item) {  
	        if(!typeAheadUpdaterCheck){
	        	typeAheadUpdaterCheck=true;
	        	var item = JSON.parse(item);
		        $("#inputWardRoomTypeId").val(item.id);

		        $.ajax({
						  type: 'POST',
						  url: ajaxGetImedRoomPriceUrl,
						  data: {'base_room_type_id': $("#inputWardRoomTypeId").val()},
						  beforeSend: function(){
						  },
						  success: function(data) {
						  	if(data!=null){
						  		$("#inputWardPrice").val(data.room_price);
						  	}
						  	else{
						  	}
							},
						  dataType: "json",
						  async:true,	  
					    timeout: 10000,
						  complete: function(){
						  },
						  error: function(){	  	
						  }
						});	

		        setTimeout(function(){
		        	typeAheadUpdaterCheck=false;
		        },300);
		      }
	        return item;
		    },
		    source: function (query, process) {
		    	var $items = new Array;
        	$items = [""];
		    	return $.ajax({
            url: elem.data('link'),
            type: 'post',
            data: { query: query },
            dataType: 'json',
            success: function (data) {
            	$.map(data, function(data){
                  var group;
                  group = {
                      id: data.id,
                      detail: data.detail,                            
                      toString: function () {
                          return JSON.stringify(this);
                      },
                      toLowerCase: function () {
                          return this.detail.toLowerCase();
                      },
                      indexOf: function (string) {
                          return String.prototype.indexOf.apply(this.detail, arguments);
                      },
                      replace: function (string) {
                          var value = '';
                          value +=  this.detail;
                          return  value;
                      }
                  };
                  $items.push(group);
              });

              process($items);
            }
        });
      }
		});
	});		

	$("#inputICURoomType").each(function(){
		var elem=$(this);
		elem.typeahead({
			 	updater: function(item) {  
	        if(!typeAheadUpdaterCheck){
	        	typeAheadUpdaterCheck=true;
	        	var item = JSON.parse(item);
		        $("#inputICURoomTypeId").val(item.id);

		        $.ajax({
						  type: 'POST',
						  url: ajaxGetImedRoomPriceUrl,
						  data: {'base_room_type_id': $("#inputICURoomTypeId").val()},
						  beforeSend: function(){
						  },
						  success: function(data) {
						  	if(data!=null){
						  		$("#inputICUPrice").val(data.room_price);
						  	}
						  	else{
						  	}
							},
						  dataType: "json",
						  async:true,	  
					    timeout: 10000,
						  complete: function(){
						  },
						  error: function(){	  	
						  }
						});	

		        setTimeout(function(){
		        	typeAheadUpdaterCheck=false;
		        },300);
		      }
	        return item;
		    },
		    source: function (query, process) {
		    	var $items = new Array;
        	$items = [""];
		    	return $.ajax({
            url: elem.data('link'),
            type: 'post',
            data: { query: query },
            dataType: 'json',
            success: function (data) {
            	$.map(data, function(data){
                  var group;
                  group = {
                      id: data.id,
                      detail: data.detail,                            
                      toString: function () {
                          return JSON.stringify(this);
                      },
                      toLowerCase: function () {
                          return this.detail.toLowerCase();
                      },
                      indexOf: function (string) {
                          return String.prototype.indexOf.apply(this.detail, arguments);
                      },
                      replace: function (string) {
                          var value = '';
                          value +=  this.detail;
                          return  value;
                      }
                  };
                  $items.push(group);
              });

              process($items);
            }
        });
      }
		});
	});		

	$("#inputHN").keyup(function (){
		var hn=$(this).val();
		if((hn.length==1 || hn.length==4) && hn.length>oldCheckHn.length){
			hn+="-";
			$(this).val(hn);
		}

		if(oldCheckHn!=hn){
			if(hn.length==11){
				estCostGetPatientByHn(hn);
			}
			else{
		  	$("#div-inputHN span.help-inline").html('');
			}
		}
		oldCheckHn=hn;
	});


	$("#inputTitleName").change(function(){
		if($(this).val()=="other"){
			$("#inputTitleNameOther").closest('div.control-group').show();
		}
		else{
			$("#inputTitleNameOther").closest('div.control-group').hide();
		}
	});

	$("#inputWardPrice, #inputWardDay").keyup(function(){
		if(!isNaN($("#inputWardPrice").val()) && !isNaN($("#inputWardDay").val())){
			$("#inputWardTotal").val(parseFloat($("#inputWardPrice").val()*$("#inputWardDay").val()).formatMoney(2,'.',','));
		}
		calEstCostTotalPrice();
	});

	$("#inputICUPrice, #inputICUDay").keyup(function(){
		if(!isNaN($("#inputICUPrice").val()) && !isNaN($("#inputICUDay").val())){
			$("#inputICUTotal").val(parseFloat($("#inputICUPrice").val()*$("#inputICUDay").val()).formatMoney(2,'.',','));
		}
		calEstCostTotalPrice();
	});

	$("#inputDRGPrice, #inputDRGDay").keyup(function(){
		if(!isNaN($("#inputDRGPrice").val()) && !isNaN($("#inputDRGDay").val())){
			$("#inputDRGTotal").val(parseFloat($("#inputDRGPrice").val()*$("#inputDRGDay").val()).formatMoney(2,'.',','));
		}
		calEstCostTotalPriceDrg();
	});

	$("#inputDrgW3").keyup(function(){
		if(!isNaN($("#inputDrgW3").val())){
			calEstCostTotalPriceDrg();
		}
	});
	$("#inputDrgCheckup").keyup(function(){
		if(!isNaN($("#inputDrgCheckup").val())){
			calEstCostTotalPriceDrg();
		}
	});

	$("#inputW3Price, #inputW3Day").keyup(function(){
		if(!isNaN($("#inputW3Price").val()) && !isNaN($("#inputW3Day").val())){
			$("#inputW3Total").val(parseFloat($("#inputW3Price").val()*$("#inputW3Day").val()).formatMoney(2,'.',','));

			$("#inputDrgW3Price").val($("#inputW3Price").val());
			$("#inputDrgW3").val(parseFloat($("#inputW3Price").val()*$("#inputW3Day").val()));
			calEstCostTotalPriceDrg();
		}
		calEstCostTotalPrice();
	});

	$("#inputDrgW3Price").keyup(function(){
		if(!isNaN($("#inputDrgW3Price").val())){
			$("#inputDrgW3").val($("#inputDrgW3Price").val());
			calEstCostTotalPriceDrg();
		}
	});

	$("#inputAnesPrice, #inputAnesDay").keyup(function(){
		if(!isNaN($("#inputAnesPrice").val()) && !isNaN($("#inputAnesDay").val())){
			$("#inputAnesTotal").val(parseFloat($("#inputAnesPrice").val()*$("#inputAnesDay").val()).formatMoney(2,'.',','));
		}
		calEstCostTotalPrice();
	});

	$("#inputOpPrice, #inputOpDay").keyup(function(){
		if(!isNaN($("#inputOpPrice").val()) && !isNaN($("#inputOpDay").val())){
			$("#inputOpTotal").val(parseFloat($("#inputOpPrice").val()*$("#inputOpDay").val()).formatMoney(2,'.',','));
		}
		calEstCostTotalPrice();
	});

	$("#inputOpRoomPrice, #inputOpRoomDay").keyup(function(){
		if(!isNaN($("#inputOpRoomPrice").val()) && !isNaN($("#inputOpRoomDay").val())){
			$("#inputOpRoomTotal").val(parseFloat($("#inputOpRoomPrice").val()*$("#inputOpRoomDay").val()).formatMoney(2,'.',','));
		}
		calEstCostTotalPrice();
	});

	$("#inputCheckupPrice, #inputCheckupDay").keyup(function(){
		if(!isNaN($("#inputCheckupPrice").val()) && !isNaN($("#inputCheckupDay").val())){
			$("#inputCheckupTotal").val(parseFloat($("#inputCheckupPrice").val()*$("#inputCheckupDay").val()).formatMoney(2,'.',','));

			$("#inputDrgCheckupPrice").val($("#inputCheckupPrice").val());
			$("#inputDrgCheckup").val(parseFloat($("#inputCheckupPrice").val()*$("#inputCheckupDay").val()));
			calEstCostTotalPriceDrg();
		}
		calEstCostTotalPrice();
	});

	$("#inputDrgCheckupPrice").keyup(function(){
		if(!isNaN($("#inputDrgCheckupPrice").val())){
			$("#inputDrgCheckup").val($("#inputDrgCheckupPrice").val());
			calEstCostTotalPriceDrg();
		}
	});

	$("#inputVisitDay").keyup(function(){
		updateEstCostVisitDay();
	});	

	$("#inputICURoomDay").keyup(function(){
		updateEstCostVisitDay();
	});

	$("#inputOpLengthHour").keyup(function(){
		updateEstCostOpLength();
	});
	$("#inputOpLengthMin").keyup(function(){
		updateEstCostOpLength();
	});
	$("#inputSpecialToolPrice").keyup(function(){
		$("#inputW3Price").val($(this).val());
		if(!isNaN($("#inputW3Price").val()) && !isNaN($("#inputW3Day").val())){
			$("#inputW3Total").val(parseFloat($("#inputW3Price").val()*$("#inputW3Day").val()).formatMoney(2,'.',','));
		}
		calEstCostTotalPrice();
	});
	$("#inputDoctorFee").keyup(function(){
		$("#inputOpPrice").val($(this).val());
		if(!isNaN($("#inputOpPrice").val()) && !isNaN($("#inputOpDay").val())){
			$("#inputOpTotal").val(parseFloat($("#inputOpPrice").val()*$("#inputOpDay").val()).formatMoney(2,'.',','));
		}
		calEstCostTotalPrice();
	});

}
function updateEstCostOpLength(){
	var hrLength=0;
	if(!isNaN($("#inputOpLengthHour").val())){
		hrLength+=parseFloat($("#inputOpLengthHour").val());
	}
	if(!isNaN($("#inputOpLengthMin").val())){
		hrLength+=parseFloat($("#inputOpLengthMin").val()/60);
	}
	$("#inputAnesDay").val(parseFloat(hrLength).formatMoney(2,'.',','));

	if(!isNaN($("#inputAnesPrice").val()) && !isNaN($("#inputAnesDay").val())){
		$("#inputAnesTotal").val(parseFloat($("#inputAnesPrice").val()*$("#inputAnesDay").val()).formatMoney(2,'.',','));
	}
	calEstCostTotalPrice();
}
function updateEstCostVisitDay(){
	if(!isNaN($("#inputVisitDay").val()) && !isNaN($("#inputICURoomDay").val())){
		$("#inputWardDay").val($("#inputVisitDay").val()-$("#inputICURoomDay").val());
		$("#inputICUDay").val($("#inputICURoomDay").val());
	}
	else if(!isNaN($("#inputVisitDay").val())){
		$("#inputWardDay").val($("#inputVisitDay").val());
	}
		
	if(!isNaN($("#inputWardPrice").val()) && !isNaN($("#inputWardDay").val())){
		$("#inputWardTotal").val(parseFloat($("#inputWardPrice").val()*$("#inputWardDay").val()).formatMoney(2,'.',','));
	}
	if(!isNaN($("#inputICUPrice").val()) && !isNaN($("#inputICUDay").val())){
		$("#inputICUTotal").val(parseFloat($("#inputICUPrice").val()*$("#inputICUDay").val()).formatMoney(2,'.',','));
	}

	calEstCostTotalPrice();
}
function acceptEstCost(est_cost_id,dataTable){
	openModal("ยืนยัน","ยืนยัน คนไข้ยินยอม?",true,function(){
		showPageLoading();
		$.post(estCostAcceptUrl, {"est_cost_id":est_cost_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","บันทึกเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
function rejectEstCost(est_cost_id,dataTable){
	openModal("ยืนยัน","ยืนยัน คนไข้ไม่ยินยอม?",true,function(){
		showPageLoading();
		$.post(estCostRejectUrl, {"est_cost_id":est_cost_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","บันทึกเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
function cancelEstCost(est_cost_id,dataTable){
	openModal("ยืนยัน","ยืนยันการยกเลิก?",true,function(){
		showPageLoading();
		$.post(estCostCancelUrl, {"est_cost_id":est_cost_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","บันทึกเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
//est_cost-index
if(viewName=="est_cost-index"){
	$(document).ready(function() {
		bpkDataTable=$('#est_cost-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
        { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.hos_detail;
					}
				},
        { 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
					return full.est_cost_no;
				}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.patient_name;
				} 
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.hn;
				} 
				},
				{ 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
				return full.age;
				} 
				},
				{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
				return full.est_date;
				}
				},
				{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
					if(full.est_status=="NA"){
						return '<span class="label label-info">ยังไม่ระบุ</span>';
					}
					else if(full.est_status=="A"){
						return '<span class="label label-success">ยินยอม</span>';
					}
					else if(full.est_status=="R"){
						return '<span class="label label-important">ไม่ยินยอม</span>';
					}
					else if(full.est_status=="C"){
						return '<span class="label label-warning">ยกเลิก</span>';
					}
					return '';
				}
				},
				{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
				return full.create_date;
				}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.condition;
				}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.icd9;
				}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.icd10;
				}
				},
	      { "mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						var returnHtml="";						
							returnHtml+='<div class="btn-group">'
			            		+'<a class="btn-more btn btn-info dropdown-toggle" data-toggle="dropdown" href="#">'
			            		+'	More'
			            		+'	<span class="caret"></span>'
			            		+'</a>'
			            		+'<ul class="dropdown-menu">'
			            if(full.est_status!="A"){
			            	returnHtml+='<li><a href="#" onclick="acceptEstCost(\''+full.est_cost_id+'\',$(\'#est_cost-datatable\')); return false;"><span>ยินยอม</span></a></li>';
			            }
			            if(full.est_status!="R"){
			            	returnHtml+='<li><a href="#" onclick="rejectEstCost(\''+full.est_cost_id+'\',$(\'#est_cost-datatable\')); return false;"><span>ไม่ยินยอม</span></a></li>';
			            }
			            if(full.est_status!="C"){
			            	returnHtml+='<li><a href="#" onclick="cancelEstCost(\''+full.est_cost_id+'\',$(\'#est_cost-datatable\')); return false;"><span>ยกเลิก</span></a></li>';
			            }
			            if(full.est_status=="NA"){
			            	if(full.is_pyh_form=='T'){
			            		returnHtml+='<li><a target="_blank" href="'+estCostPyhUrl+'/'+full.est_cost_id+'"><span>แก้ไข</span></a></li>'
			            	}
			            	else{
			            		returnHtml+='<li><a target="_blank" href="'+estCostEditUrl+'/'+full.est_cost_id+'"><span>แก้ไข</span></a></li>'
			            	}
			            }
		            	if(full.is_pyh_form=='T'){
		            		returnHtml+='<li><a target="_blank" href="'+estCostPrintPyhUrl+'/'+full.est_cost_id+'"><span>ดู/พิมพ์แบบฟอร์ม</span></a></li>'
		            	}
		            	else{
			            	returnHtml+='<li><a target="_blank" href="'+estCostPrintUrl+'/'+full.est_cost_id+'"><span>ดู/พิมพ์แบบฟอร์ม</span></a></li>'
			            	returnHtml+='<li><a target="_blank" href="'+estCostPrintUrl+'/'+full.est_cost_id+'/en"><span>ดู/พิมพ์แบบฟอร์ม ENG</span></a></li>'
		            	}
			            		+'</ul>'
			            	+'</div>';
			            return returnHtml;
					}
				}
	     ],
	    "aaSorting": [[ 2, "desc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
	      aoData.push( { "name": "est_cost_no", "value": $("#inputEstCostNo").val() } );
	      aoData.push( { "name": "patient_name", "value": $("#inputPatientName").val() } );
	      aoData.push( { "name": "hn", "value": $("#inputHN").val() } );
	      aoData.push( { "name": "hos_id", "value": $("#inputHospitalId").val() } );
	      aoData.push( { "name": "est_status", "value": $("#inputEstStatus").val() } );
	      aoData.push( { "name": "est_date_start", "value": $("#inputEstDateStart").val() } );
	      aoData.push( { "name": "est_date_end", "value": $("#inputEstDateEnd").val() } );
	      aoData.push( { "name": "create_date_start", "value": $("#inputCreateDateStart").val() } );
	      aoData.push( { "name": "create_date_end", "value": $("#inputCreateDateEnd").val() } );
	      aoData.push( { "name": "condition", "value": $("#inputCondition").val() } );
	      aoData.push( { "name": "icd10", "value": $("#inputICD10").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-est_cost-submit").click(function(){
			bpkDataTableSearchSubmit(bpkDataTable);
			return false;
		});
	});
}
//end est_cost-index
//end est_cost


//doc_command
function validateDocCommandAddForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputTopic]")) && passValidate;
	passValidate=checkInputTypeSelect($("#inputHospitalId")) && passValidate;

	return passValidate;
}
function validateDocCommandEditForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputTopic]")) && passValidate;
	passValidate=checkInputTypeSelect($("#inputHospitalId")) && passValidate;

	return passValidate;
}
//doc_command-index
if(viewName=="doc_command-index"){
	$(document).ready(function() {
		bpkDataTable=$('#doc_command-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
        { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.hos_detail;
					}
				},
        { 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
					return full.doc_command_no;
				}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.topic;
				} 
				},
				{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
					if(full.doc_status=="NA"){
						return '<span class="label label-info">ปกติ</span>';
					}
					else if(full.doc_status=="C"){
						return '<span class="label label-warning">ยกเลิก</span>';
					}
					return '';
				}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.create_by_name;
				} 
				},
				{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
				return full.create_date;
				}
				},
	      { "mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						var returnHtml="";						
							returnHtml+='<div class="btn-group">'
			            		+'<a class="btn-more btn btn-info dropdown-toggle" data-toggle="dropdown" href="#">'
			            		+'	More'
			            		+'	<span class="caret"></span>'
			            		+'</a>'
			            		+'<ul class="dropdown-menu">'
			            if(full.doc_status!="C"){
			            	returnHtml+='<li><a href="#" onclick="cancelDocCommand(\''+full.doc_command_id+'\',$(\'#doc_command-datatable\')); return false;"><span>ยกเลิก</span></a></li>';
			            }
			            if(full.doc_status=="NA"){
			            	returnHtml+='<li><a target="_blank" href="'+docCommandEditUrl+'/'+full.doc_command_id+'"><span>แก้ไข</span></a></li>'
			            }
			            	returnHtml+='<li><a target="_blank" href="'+docCommandPrintUrl+'/'+full.doc_command_id+'"><span>พิมพ์แบบฟอร์ม</span></a></li>'
			            		+'</ul>'
			            	+'</div>';
			            return returnHtml;
					}
				}
	     ],
	    "aaSorting": [[ 2, "desc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
	      aoData.push( { "name": "doc_command_no", "value": $("#inputDocCommandNo").val() } );
	      aoData.push( { "name": "topic", "value": $("#inputTopic").val() } );
	      aoData.push( { "name": "hos_id", "value": $("#inputHospitalId").val() } );
	      aoData.push( { "name": "doc_status", "value": $("#inputDocStatus").val() } );
	      aoData.push( { "name": "create_date_start", "value": $("#inputCreateDateStart").val() } );
	      aoData.push( { "name": "create_date_end", "value": $("#inputCreateDateEnd").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-doc_command-submit").click(function(){
			bpkDataTableSearchSubmit(bpkDataTable);
			return false;
		});
	});
}
//end doc_command-index


//doc_notice
function validateDocNoticeAddForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputTopic]")) && passValidate;
	passValidate=checkInputTypeSelect($("#inputHospitalId")) && passValidate;

	return passValidate;
}
function validateDocNoticeEditForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputTopic]")) && passValidate;
	passValidate=checkInputTypeSelect($("#inputHospitalId")) && passValidate;

	return passValidate;
}
//doc_notice-index
if(viewName=="doc_notice-index"){
	$(document).ready(function() {
		bpkDataTable=$('#doc_notice-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
        { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.hos_detail;
					}
				},
        { 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
					return full.doc_notice_no;
				}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.topic;
				} 
				},
				{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
					if(full.doc_status=="NA"){
						return '<span class="label label-info">ปกติ</span>';
					}
					else if(full.doc_status=="C"){
						return '<span class="label label-warning">ยกเลิก</span>';
					}
					return '';
				}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.create_by_name;
				} 
				},
				{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
				return full.create_date;
				}
				},
	      { "mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						var returnHtml="";						
							returnHtml+='<div class="btn-group">'
			            		+'<a class="btn-more btn btn-info dropdown-toggle" data-toggle="dropdown" href="#">'
			            		+'	More'
			            		+'	<span class="caret"></span>'
			            		+'</a>'
			            		+'<ul class="dropdown-menu">'
			            if(full.doc_status!="C"){
			            	returnHtml+='<li><a href="#" onclick="cancelDocNotice(\''+full.doc_notice_id+'\',$(\'#doc_notice-datatable\')); return false;"><span>ยกเลิก</span></a></li>';
			            }
			            if(full.doc_status=="NA"){
			            	returnHtml+='<li><a target="_blank" href="'+docNoticeEditUrl+'/'+full.doc_notice_id+'"><span>แก้ไข</span></a></li>'
			            }
			            	returnHtml+='<li><a target="_blank" href="'+docNoticePrintUrl+'/'+full.doc_notice_id+'"><span>พิมพ์แบบฟอร์ม</span></a></li>'
			            		+'</ul>'
			            	+'</div>';
			            return returnHtml;
					}
				}
	     ],
	    "aaSorting": [[ 2, "desc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
	      aoData.push( { "name": "doc_notice_no", "value": $("#inputDocNoticeNo").val() } );
	      aoData.push( { "name": "topic", "value": $("#inputTopic").val() } );
	      aoData.push( { "name": "hos_id", "value": $("#inputHospitalId").val() } );
	      aoData.push( { "name": "doc_status", "value": $("#inputDocStatus").val() } );
	      aoData.push( { "name": "create_date_start", "value": $("#inputCreateDateStart").val() } );
	      aoData.push( { "name": "create_date_end", "value": $("#inputCreateDateEnd").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-doc_notice-submit").click(function(){
			bpkDataTableSearchSubmit(bpkDataTable);
			return false;
		});
	});
}
//end doc_notice-index


//doc_note
function validateDocNoteAddForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputTopic]")) && passValidate;
	passValidate=checkInputTypeSelect($("#inputHospitalId")) && passValidate;

	return passValidate;
}
function validateDocNoteEditForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputTopic]")) && passValidate;
	passValidate=checkInputTypeSelect($("#inputHospitalId")) && passValidate;

	return passValidate;
}
//doc_note-index
if(viewName=="doc_note-index"){
	$(document).ready(function() {
		bpkDataTable=$('#doc_note-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
        { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.hos_detail;
					}
				},
        { 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
					return full.doc_note_no;
				}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.topic;
				} 
				},
				{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
					if(full.doc_status=="NA"){
						return '<span class="label label-info">ปกติ</span>';
					}
					else if(full.doc_status=="C"){
						return '<span class="label label-warning">ยกเลิก</span>';
					}
					return '';
				}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.create_by_name;
				} 
				},
				{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
				return full.create_date;
				}
				},
	      { "mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						var returnHtml="";						
							returnHtml+='<div class="btn-group">'
			            		+'<a class="btn-more btn btn-info dropdown-toggle" data-toggle="dropdown" href="#">'
			            		+'	More'
			            		+'	<span class="caret"></span>'
			            		+'</a>'
			            		+'<ul class="dropdown-menu">'
			            if(full.doc_status!="C"){
			            	returnHtml+='<li><a href="#" onclick="cancelDocNote(\''+full.doc_note_id+'\',$(\'#doc_note-datatable\')); return false;"><span>ยกเลิก</span></a></li>';
			            }
			            if(full.doc_status=="NA"){
			            	returnHtml+='<li><a target="_blank" href="'+docNoteEditUrl+'/'+full.doc_note_id+'"><span>แก้ไข</span></a></li>'
			            }
			            	returnHtml+='<li><a target="_blank" href="'+docNotePrintUrl+'/'+full.doc_note_id+'"><span>พิมพ์แบบฟอร์ม</span></a></li>'
			            		+'</ul>'
			            	+'</div>';
			            return returnHtml;
					}
				}
	     ],
	    "aaSorting": [[ 2, "desc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
	      aoData.push( { "name": "doc_note_no", "value": $("#inputDocNoteNo").val() } );
	      aoData.push( { "name": "topic", "value": $("#inputTopic").val() } );
	      aoData.push( { "name": "hos_id", "value": $("#inputHospitalId").val() } );
	      aoData.push( { "name": "doc_status", "value": $("#inputDocStatus").val() } );
	      aoData.push( { "name": "create_date_start", "value": $("#inputCreateDateStart").val() } );
	      aoData.push( { "name": "create_date_end", "value": $("#inputCreateDateEnd").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-doc_note-submit").click(function(){
			bpkDataTableSearchSubmit(bpkDataTable);
			return false;
		});
	});
}
//end doc_note-index


//logon
function validateLogonForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeText($("input[name=password]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=username]")) && passValidate;

	return passValidate;
}
if(viewName=="logon"){
}
//end logon

//queue
if(viewName=="queue-index"){
	// $("#inputRequestType_Queue").change(function(){		
	// 	ajaxGetServiceType($("#inputRequestType_Queue"),$("#inputSectionId_Queue"),$("#inputServiceTypeId_Queue"),null,'T');
	// });

	$("#inputInformHospitalId_Queue").change(function(){
		ajaxGetSectionFromHospital($("#inputInformHospitalId_Queue"),$("#inputInformSectionId_Queue"),null,'T');
	});

	// $("#inputInformHospitalId_Queue").val(userHosId);
	ajaxGetSectionFromHospital($("#inputInformHospitalId_Queue"),$("#inputInformSectionId_Queue"),userSectionId,'',function(){ functionInitTableQueue(); });

	$("#inputInformHospitalId_Project").change(function(){
		ajaxGetSectionFromHospital($("#inputInformHospitalId_Project"),$("#inputInformSectionId_Project"),null,'T');
	});
	$("#inputAcceptHospitalId_Project").change(function(){
		ajaxGetSectionFromHospital($("#inputAcceptHospitalId_Project"),$("#inputAcceptSectionId_Project"),null,'T');
	});

	$("#inputInformHospitalId_Project").val(userHosId);
	$("#inputAcceptHospitalId_Project").val(userHosId);
	ajaxGetSectionFromHospital($("#inputInformHospitalId_Project"),$("#inputInformSectionId_Project"),userSectionId,'T',function(){ 
		ajaxGetSectionFromHospital($("#inputAcceptHospitalId_Project"),$("#inputAcceptSectionId_Project"),userSectionId,'T',function(){ functionInitTableProject(); });
	});

	$("#inputAcceptHospitalId_Project").closest("form").on('reset',function() {
		setTimeout(function(){
			ajaxGetSectionFromHospital($("#inputInformHospitalId_Project"),$("#inputInformSectionId_Project"),null,'T');
			ajaxGetSectionFromHospital($("#inputAcceptHospitalId_Project"),$("#inputAcceptSectionId_Project"),null,'T');
	  },100);
	});

	var functionInitTableQueue=function(){
		//Table Queue
		var bpkDataTableQueue=$('#queue-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	      { 	"mData" : null, "sClass": "right" },
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.project_id;
					}
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.title;
					} 
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.inform_hos_detail;
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.inform_section_detail;
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.inform_emp_name;
					} 
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.request_priority_detail;
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.inform_date;
					}
				},				
	      { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+projectViewUrl+'/'+full.project_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="icon-search icon-white"></i></a>';
					}
				},
	      { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="'+queueAcceptRequestUrl+'/'+full.project_id+'" class="btn btn-primary" rel="tooltip" data-title="รับงาน"><i class="icon-ok icon-white"></i></a>';
					}
				},
	      { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="'+queueCreatProjectUrl+'/'+full.project_id+'" class="btn btn-success" rel="tooltip" data-title="สร้างใบบันทึก"><i class="icon-plus-sign icon-white"></i></a>';
					}
				},
	      { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.attachment_count>0){
							return '<i class="icon-file"></i>';
						}
						else{
							return '';
						}
					}
				}
	    ],
	    "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl_Queue,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
			      aoData.push( { "name": "project_id", "value": $("#inputProjectId_Queue").val() } );
			      aoData.push( { "name": "title", "value": $("#inputTitle_Queue").val() } );
			      // aoData.push( { "name": "request_type_id", "value": $("#inputRequestType_Queue").val() } );
			      // aoData.push( { "name": "servicetype_id", "value": $("#inputServiceTypeId_Queue").val() } );
			      aoData.push( { "name": "inform_hos_id", "value": $("#inputInformHospitalId_Queue").val() } );
			      aoData.push( { "name": "inform_section_id", "value": $("#inputInformSectionId_Queue").val() } );
			      aoData.push( { "name": "inform_emp_name", "value": $("#inputInformEmpName_Queue").val() } );
			      aoData.push( { "name": "request_priority_id", "value": $("#inputRequestPriority_Queue").val() } );
			      aoData.push( { "name": "inform_date_start", "value": $("#inputInformDateStart_Queue").val() } );
			      aoData.push( { "name": "inform_date_end", "value": $("#inputInformDateEnd_Queue").val() } );
			      aoData.push( { "name": "description", "value": $("#inputDesc_Queue").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTableQueue.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-queue-submit").click(function(){
			bpkDataTableSearchSubmit(bpkDataTableQueue);
			return false;
		});
		//refresh table queue automatically
		setInterval('bpkDataTableSearchSubmit($("table#queue-datatable.display"));',1000*60*5);
	};

	var functionInitTableProject=function(){
		//Table Project		
		var bpkDataTableProject=$('#project-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	      { 	"mData" : null, "sClass": "right" },
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.project_id;
					}
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.title;
					} 
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.request_type_detail;
					} 
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.inform_section_detail;
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.inform_emp_name;
					} 
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.accept_section_detail;
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.incharge_emp_name;
					} 
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.request_priority_id=="0"){
							return '<span class="label label-important">'+full.request_priority_detail+'</span>';
						}
						else{
							return '<span class="label label-info">'+full.request_priority_detail+'</span>';
						}						
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.inform_date;
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.project_status_detail;
					}
				},
	      { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {	
						return '<a target="_blank" href="'+projectViewUrl+'/'+full.project_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="icon-search icon-white"></i></a>';
					}
				}
	    ],
	    "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl_Project,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
			      aoData.push( { "name": "project_id", "value": $("#inputProjectId_Project").val() } );
			      aoData.push( { "name": "title", "value": $("#inputTitle_Project").val() } );
			      aoData.push( { "name": "request_type_id", "value": $("#inputRequestType_Project").val() } );
			      aoData.push( { "name": "inform_section_id", "value": $("#inputInformSectionId_Project").val() } );
			      aoData.push( { "name": "accept_section_id", "value": $("#inputAcceptSectionId_Project").val() } );
			      aoData.push( { "name": "inform_emp_name", "value": $("#inputInformEmpName_Project").val() } );
			      aoData.push( { "name": "incharge_emp_name", "value": $("#inputInchargeEmpName_Project").val() } );
			      aoData.push( { "name": "request_priority_id", "value": $("#inputRequestPriority_Project").val() } );
			      aoData.push( { "name": "project_status_id", "value": $("#inputProjectStatus_Project").val() } );
			      aoData.push( { "name": "inform_date_start", "value": $("#inputInformDateStart_Project").val() } );
			      aoData.push( { "name": "inform_date_end", "value": $("#inputInformDateEnd_Project").val() } );
			      aoData.push( { "name": "view_type", "value": $("#inputProjectViewType_Project").val() } );
			      aoData.push( { "name": "description", "value": $("#inputDesc_Project").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTableProject.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-project-submit").click(function(){
			bpkDataTableSearchSubmit(bpkDataTableProject);
			return false;
		});
	};
}
//end queue

//request
function winAppFinishScan(elem,tmp_file_running_no,data){	
	var parentElem=$(elem).closest('div.fileupload');
	var twainUploadTmpRunningNo=parentElem.find("input[name='twainUploadTmpRunningNo[]']");
	var twainUploadFileName=parentElem.find("input[name='twainUploadFileName[]']");
	twainUploadTmpRunningNo.val(data.tmp_file_running_no);
	bootstrapFileInputChange(twainUploadTmpRunningNo);
	parentElem.find('span.btn.btn-file').hide();
	parentElem.find('a.btn.fileupload-exists').show();
	parentElem.find('a.btn.fileupload-exists').click(function(){
		$(this).closest('div.fileupload').remove();
	});
	parentElem.find('a.twainStartScan').hide();
	var fileName=data.upload_date.substring(0,10)+'-'+(parentElem.index()+1);
	parentElem.find('span.fileupload-preview').html(fileName);
	twainUploadFileName.val(fileName);
	if($("#inputTitle").val()=="") $("#inputTitle").val('ตามเอกสารแนบ');
	if($("#inputTaskTitle").val()=="") $("#inputTaskTitle").val('ตามเอกสารแนบ');
}
function winAppScanCheck(elem){
	$.ajax({
	  type: 'POST',
	  url: ajaxTwainScanCheckUrl,
	  data: {'bpk_scan_id':bpk_scan_id},
	  success: function(data) {
	  	data=data.data;
	   	if(data.tmp_file_running_no!=null){
	   		winAppFinishScan(elem,data.tmp_file_running_no,data)
	   	}
	   	else{
				winAppScanTimeout=setTimeout(function(){
					winAppScanCheck(elem);
				},3000);
	   	}
		},
	  dataType: "json",
	  async:true
	});
}
function winAppStartScan(elem){
	clearTimeout(winAppScanTimeout);
	$.ajax({
	  type: 'POST',
	  url: ajaxWinAppStartScanUrl,
	  data: {'bpk_scan_id':bpk_scan_id},
	  success: function(data) {
			winAppScanTimeout=setTimeout(function(){
				winAppScanCheck(elem);
			},5000);
		},
	  dataType: "json",
	  async:true
	});
}
function twainStartScan(elem){
	$("#inputPostTmpFileScanRunningNo").val('');
	if($("#inputPostTmpFileScanRunningNo").val()==""){
		$.ajax({
			beforeSend: showPageLoading,
		  type: 'POST',
		  url: ajaxAddTmpFileRunningNoUrl,
		  data: {},
		  success: function(data) {
		   	hidePageLoading();
				$("#inputPostTmpFileScanRunningNo").val(data.tmp_file_running_no);
			},
		  dataType: "json",
		  async:false
		});
	}
	else{
		$.ajax({
			beforeSend: showPageLoading,
		  type: 'POST',
		  url: ajaxStartScanUrl,
		  data: { "tmp_file_running_no" : $("#inputPostTmpFileScanRunningNo").val()},
		  success: function(data) {
		   	hidePageLoading();
			},
		  dataType: "json",
		  async:false
		});
	}
  try {
  	showPageLoading();
		TwainX.config (150, 150, 2, 0, 0, 
	 	 "c:/bpk_scan_result/", "x", 1, 1);
		TwainX.scanRegions(
		  "c:/bpk_scan_result/", 
		  "145,360,200,250,region1.jpg,24,30,5300", 
		  1, "pdf"+";"+$("#inputPostTmpFileScanRunningNo").val()+";"+twainScannerPostUrl, 0);
		hidePageLoading();
		$.ajax({
			beforeSend: showPageLoading,
		  type: 'POST',
		  url: ajaxGetScanResultUrl,
		  data: { "tmp_file_running_no" : $("#inputPostTmpFileScanRunningNo").val()},
		  success: function(data) {
		   	hidePageLoading();
		  	data=data.data;
		  	if(data.upload_status=='0'){
		  		alert('scan not complete');
		  	}
		  	else{
		  		// console.log(data);
		  		var parentElem=$(elem).closest('div.fileupload');
		  		var twainUploadTmpRunningNo=parentElem.find("input[name='twainUploadTmpRunningNo[]']");
		  		var twainUploadFileName=parentElem.find("input[name='twainUploadFileName[]']");
		  		twainUploadTmpRunningNo.val($("#inputPostTmpFileScanRunningNo").val());
		  		bootstrapFileInputChange(twainUploadTmpRunningNo);
		  		parentElem.find('span.btn.btn-file').hide();
		  		parentElem.find('a.btn.fileupload-exists').show();
		  		parentElem.find('a.btn.fileupload-exists').click(function(){
		  			$(this).closest('div.fileupload').remove();
		  		});
		  		parentElem.find('a.twainStartScan').hide();
		  		var fileName=data.upload_date.substring(0,10)+'-'+(parentElem.index()+1);
		  		parentElem.find('span.fileupload-preview').html(fileName);
		  		twainUploadFileName.val(fileName);
		  		if($("#inputTitle").val()=="") $("#inputTitle").val('ตามเอกสารแนบ');
		  		if($("#inputTaskTitle").val()=="") $("#inputTaskTitle").val('ตามเอกสารแนบ');
			  // 	$("#inputPostPageCount").val(data.page_count);
					// $("#inputPostFileSize").val(data.file_size);
					// $("#inputPostFileType").val(data.file_type);
					// $("#importFile_FileSize").val((data.file_size/1024/1024).formatMoney(2,'.',',')+' MB');
					// $("#importFile_FileType").val(data.file_type);
					// $("#importFile_PageCount").val(parseInt(data.page_count).formatMoney(0,'.',','));
					// $("input[name=inputScanFileType][value="+data.file_type+"]").prop('checked', true);
					// if(data.file_type=='pdf'){
					// 	$("input[name=inputScanFileType][value=jpg]").attr('disabled',true);
					// }
					// $("button.twainContinueScan").removeClass('hide');
					// $("button.twainResetScan").removeClass('hide');
					// $("button.twainStartScan").addClass('hide');
					// if($("#inputPostDocId").val()==''){
					// 	if(data.dir_path!=null && data.dir_path!=""){
					// 		var dirArray = data.dir_path.split("/"); 
					// 		jQuery("#jstree-manage").jstree("deselect_all");
					// 		jstreeRecursiveOpenNode(dirArray,data.current_year,0);
					// 	}
					// }
				}
			},
		  dataType: "json",
		  async:true
		});

	}catch (e){		
		alert(e);
  	hidePageLoading();
		alert("scanner error");
	}	
}
function validateRequestForm(){
	var passValidate=true;
	//check input bottom up
	// passValidate=checkInputTypeSelect($("#inputRequestPriority")) && passValidate;
	var hasScan=false;
	$("input[name='twainUploadFileName[]']").each(function(){
		if($(this).val()!="") hasScan=true;
	});

	if(hasScan==false){
		passValidate=checkInputTypeText($("#inputDescription"),3) && passValidate;
	}
	// passValidate=checkInputTypeSelect($("#inputService")) && passValidate;
	// passValidate=checkInputTypeSelect($("#inputServiceType")) && passValidate;
	passValidate=checkInputTypeSelect($("#inputSectionId")) && passValidate;
	passValidate=checkInputTypeSelect($("#inputHospitalId")) && passValidate;
	// passValidate=checkInputTypeSelect($("#inputRequestType")) && passValidate;
	passValidate=checkInputTypeText($("#inputTitle"),3) && passValidate;

	return passValidate;
}
if(viewName=="request-index"){
	$("#inputHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,'T',function(){		
			ajaxGetServiceType($("#inputRequestType"),$("#inputSectionId"),$("#inputServiceType"),null,'T',function(){
				ajaxGetService($("#inputServiceType"),$("#inputService"),null,'T');
			});
		});
	});
	$("#inputSectionId, #inputRequestType").change(function(){		
		ajaxGetServiceType($("#inputRequestType"),$("#inputSectionId"),$("#inputServiceType"),null,'T',function(){
			ajaxGetService($("#inputServiceType"),$("#inputService"),null,'T');
		});
	});
	$("#inputServiceType").change(function(){		
		ajaxGetService($("#inputServiceType"),$("#inputService"),null,'T');
	});
	ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),userSectionId,'T',null);

	var inputServiceElem=$("#inputService");
	inputServiceElem.change(function(){
		var detail=inputServiceElem.find('option[value='+$(this).val()+']').attr('attr-detail-template');
		if(detail!=null && detail!=""){
			$("#inputDescription").val(detail);
		}
	});
}
//end request


//project
function projectTrackAdd(project_id){
	showPageLoading();
	$.post(projectTrackAddTrackUrl, {"emp_id": userEmpId, "project_id":project_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","บันทึกการติดตามเรียบร้อย",false,null);
			$("#buttonProjectTrackAdd").hide();
			$("#buttonProjectTrackDelete").show();
			projectTrackId=data.project_track_id;
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function projectTrackDelete(){
	showPageLoading();
	$.post(projectTrackDeleteUrl, {"project_track_id": projectTrackId}, function(data) {
		if(data.success=="OK"){
			openModal("success","ยกเลิกการติดตามเรียบร้อย",false,null);
			$("#buttonProjectTrackDelete").hide();
			$("#buttonProjectTrackAdd").show();
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function upTaskOrder(task_id,dataTable){
	showPageLoading();
	$.post(taskUpTaskOrderUrl, {"task_id":task_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","บันทึกการเปลี่ยนแปลงลำดับงานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function downTaskOrder(task_id,dataTable){
	showPageLoading();
	$.post(taskDownTaskOrderUrl, {"task_id":task_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","บันทึกการเปลี่ยนแปลงลำดับงานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function validateProjectForm(){
	var passValidate=true;
	//check input bottom up
	if($("#inputProjectDateEnd").val()!="" || $("#inputEmployeeId").val()!="" ){
		passValidate=checkInputTypeDateBetween($("#inputProjectDateStart"),$("#inputProjectDateEnd")) && passValidate;
	}
	passValidate=checkInputTypeSelect($("#inputProjectService")) && passValidate;
	passValidate=checkInputTypeText($("#inputProjectTitle"),3) && passValidate;

	return passValidate;
}
function validateProjectActivityForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeSelect($("#inputProjectActionType")) && passValidate;

	return passValidate;
}
function checkProjectFileUploadLimit(elem){
	var sumSize=0;
	$('input.inputProjectAttachmentFile').each(function(){
		if(this.files!=null && this.files.length>0){
			sumSize+=this.files[0].size;
		}
	});
	if($("#inputCurrentProjectFileSize").size()>0){
		sumSize+=parseInt($("#inputCurrentProjectFileSize").val());
	}
	//minus removing file
	$('input.inputRemovingProjectAttachmentId').each(function(){
		if($(this).is(":checked")){
			sumSize-=parseInt($(this).attr('filesize'));
		}
	});

	if(sumSize>fileSizeUploadLimit*1024*1024){
		$(elem).closest('.fileupload').fileupload('clear');
		if($(elem).closest('.fileupload').next().hasClass('fileupload-last')){
			$(elem).closest('.fileupload').next().remove();
			$(elem).closest('.fileupload').addClass('fileupload-last');
		}
		alert("ไม่อนุญาตให้ขนาดไฟล์รวมกันเกิน "+fileSizeUploadLimit+" MB");
	}
}

var selectTemplateWindow=null;
function selectTemplate(elem){
	selectingTemplateElem=elem;
	if(selectTemplateWindow!=null){
		selectTemplateWindow.close();
	}
	selectTemplateWindow=window.open(selectTemplateUrl,'select_template');
	selectTemplateWindow.focus();
}
function selectTemplateCallback(template_project_id,title){
	openModal("ยืนยันการใช้ Template","งานใน Template จะถูกนำเข้าในใบบันทึก โดยต่อท้ายจากงานเดิมที่มีอยู่<br/>ยืนยันการใช้ Template "+title+"?",true,function(){
		showPageLoading();
		var project_id=$("input[name=inputProjectId]").val();
		$.post(ajaxUseTemplateUrl, {"template_project_id":template_project_id,"project_id":project_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","งานใน Template ถูกนำเข้าในใบบันทึกเรียบร้อย",false,null);
				getDatatableDataForProjectTask();
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
function initProjectGanttChart(projectId){	
	if(ieVersion!=null && parseFloat(ieVersion) < 8){
		$(".gantt").replaceWith('<div>'+notSupportIEText+'</div>');
	}
	else{
		$.ajax({
		  type: 'POST',
		  url: ajaxProjectGanttChartUrl,
		  data: {'project_id':projectId,'inputMinTaskActualStartTime': $("#inputMinTaskActualStartTime").val(),'inputMaxTaskActualEndTime': $("#inputMaxTaskActualEndTime").val()},
		  success: function(data) {
				$(".gantt").gantt({
					source:  data,
					scale: "days",
					minScale: "hours",
					maxScale: "months",
					navigate: "scroll",
			    waitText: "Please wait...",
					itemsPerPage: 20
				});
			},
		  dataType: "json",
		  async:false
		});
	}
}
function initProjectJqplot(projectId,value_array,tick_array){
	if(ieVersion!=null && parseFloat(ieVersion) < 8){
		$("div#jqplot").replaceWith('<div>'+notSupportIEText+'</div>');
	}
	else{
		$.ajax({
		  type: 'POST',
		  url: ajaxProjectCostChartUrl,
		  data: {'project_id':projectId},
		  success: function(data) {
		  	var ticks=data.ticks;
		  	var dataArray=data.dataArray;
		  	var plot1 = $.jqplot('jqplot', dataArray, {			    
	        seriesDefaults: {
	            renderer:$.jqplot.BarRenderer,
	            // Show point labels to the right ('e'ast) of each bar.
	            // edgeTolerance of -15 allows labels flow outside the grid
	            // up to 15 pixels.  If they flow out more than that, they
	            // will be hidden.

	            pointLabels: { show: true, location: 'e', edgeTolerance: -15 ,stackedValue: true},

	            // Rotate the bar shadow as if bar is lit from top right.
	            shadowAngle: 135,
	            // Here's where we tell the chart it is oriented horizontally.
	            rendererOptions: {
	                barDirection: 'horizontal',
	                fillToZero: true
	            }
	        },
			    // Custom labels for the series are specified with the "label"
			    // option on the series option.  Here a series option object
			    // is specified for each series.
			    series:[
			    //{label:'Estimated',pointLabels: { show: true, location: 'e', edgeTolerance: -15 }},
			        {label:'Estimated'},
			        {label:'Actual'},
			        {label:'Diff'}
			    ],
			    // Show the legend and put it outside the grid, but inside the
			    // plot container, shrinking the grid to accomodate the legend.
			    // A value of "outside" would not shrink the grid and allow
			    // the legend to overflow the container.
			    legend: {
			        show: true,
			        placement: 'outsideGrid'
			    },			    
	        axes: {
	            yaxis: {
	                renderer: $.jqplot.CategoryAxisRenderer
	            },
	            xaxis: {
			            pad: 1.05,
			            tickOptions: {formatString: '฿%d'}
			        }
	        },
	        canvasOverlay: {
			      show: true,
			      objects: [
			        {	verticalLine: {
                  name: 'barney',
                  x: '0',
                  lineWidth: 3,
                  color: 'rgb(255, 0, 0)',
                  shadow: false
              }}
			      ]
			    }
				});
			},
		  dataType: "json",
		  async:false
		});
	}
}

function deleteTask(){
	var dataTable=$("#project-task-datatable");
	var nodes =  dataTable.dataTable().fnGetNodes();	
	if($('.dt-checkbox:checked', nodes).not('.disabled').size()==0){
		openModal("fail","กรุณาเลือกรายการที่ต้องการลบ",false,null);
	}
	else{
		openModal("ยืนยันการลบ","ยืนยันการลบงาน จำนวน "+$('.dt-checkbox:checked', nodes).not('.disabled').size()+" งาน?",true,function(){
			$("#form-delete-task-confirm").html('<input type="hidden" name="project_id" value="'+$("input[name=inputProjectId]").val()+'" />');
			nodes =  dataTable.dataTable().fnGetNodes();
			$('.dt-checkbox', nodes).not('.disabled').each(function(){
				if($(this).is(":checked")){
					$("#form-delete-task-confirm").append('<input type="hidden" name="inputDTCheckbox[]" value="'+$(this).val()+'"/>');
				}
			});
			$("#form-delete-task-confirm").submit();
		});
	}
}
if(viewName=="project-index"){
	var inputServiceElem=$("select#inputProjectService");
	inputServiceElem.change(function(){
		var detail=inputServiceElem.find('option[value='+$(this).val()+']').attr('attr-detail-template');
		if(detail!=null && detail!=""){
			$("#inputProjectDescription").val(detail);
		}
	});

	var onDTCheckboxChangeFunction=function(){
	};
	$("button.dt-checkbox-selectall-task").click(function(){
		DTSelectAll('project-task-datatable',onDTCheckboxChangeFunction);
	});		
	$("button.dt-checkbox-deselectall-task").click(function(){
		DTDeselectAll('project-task-datatable',onDTCheckboxChangeFunction);
	});

	if($("div.gantt").size()>0){
		initProjectGanttChart($("input[name=inputProjectId]").val());
		$("#section-project-gantt").addClass('tab-pane');
	}
	if($("#jqplot").size()>0){
		initProjectJqplot($("input[name=inputProjectId]").val());
		$("#section-project-jqplot").addClass('tab-pane');
	}
	$("input[name=inputProjectActualTimeType]").change(function(){
		var type=$(this).val();
		if(type=='P'){
			$("#inputProjectActualTimeStart").removeAttr('readonly');
			$("#inputProjectActualTimeStart").parent().find('span.add-on').removeClass('hide');
			$("#inputProjectActualTimeEnd").removeAttr('readonly');
			$("#inputProjectActualTimeEnd").parent().find('span.add-on').removeClass('hide');
		}
		else{
			$("#inputProjectActualTimeStart").attr('readonly',true);
			$("#inputProjectActualTimeStart").parent().find('span.add-on').addClass('hide');
			$("#inputProjectActualTimeEnd").attr('readonly',true);
			$("#inputProjectActualTimeEnd").parent().find('span.add-on').addClass('hide');
			$("#inputProjectActualTimeStart").val($("#inputMinTaskActualStartTime").val());
			$("#inputProjectActualTimeEnd").val($("#inputMaxTaskActualEndTime").val());
		}
	});
	$("input[name=inputProjectActualCostType]").change(function(){
		var type=$(this).val();
		if(type=='P'){
			$("#inputProjectActualCost").removeAttr('readonly');
		}
		else{
			$("#inputProjectActualCost").attr('readonly',true);
			$("#inputProjectActualCost").val($("#inputSumTaskActualCost").val());
		}
	});
	$(function(){
		if($("#inputHospitalId").size()>0){
			$("#inputHospitalId").change(function(){
				ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,'T',function(){		
					ajaxGetServiceType($("#inputRequestType"),$("#inputSectionId"),$("#inputProjectServiceType"),null,'T',function(){
						ajaxGetService($("#inputProjectServiceType"),$("#inputProjectService"),null,'T');
					});
				});
			});
			$("#inputSectionId, #inputRequestType").change(function(){		
				ajaxGetServiceType($("#inputRequestType"),$("#inputSectionId"),$("#inputProjectServiceType"),null,'T',function(){
					ajaxGetService($("#inputProjectServiceType"),$("#inputProjectService"),null,'T');
				});
			});
			$("#inputProjectServiceType").change(function(){		
				ajaxGetService($("#inputProjectServiceType"),$("#inputProjectService"),null,'T');
			});

			ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),$("#inputCurrentSectionId").val(),'T',function(){		
				ajaxGetServiceType($("#inputRequestType"),$("#inputSectionId"),$("#inputProjectServiceType"),$("#inputCurrentProjectServiceTypeId").val(),'T',function(){
					ajaxGetService($("#inputProjectServiceType"),$("#inputProjectService"),$("#inputCurrentProjectServiceId").val(),'T');
				});
			});
		}
		else{
			$("#inputRequestType").change(function(){		
				ajaxGetServiceType($("#inputRequestType"),$("#inputCurrentSectionId"),$("#inputProjectServiceType"),null,'T',function(){
					ajaxGetService($("#inputProjectServiceType"),$("#inputProjectService"),null,'T');
				});
			});
			$("#inputProjectServiceType").change(function(){		
				ajaxGetService($("#inputProjectServiceType"),$("#inputProjectService"),null,'T');
			});

			ajaxGetServiceType($("#inputRequestType"),$("#inputCurrentSectionId"),$("#inputProjectServiceType"),$("#inputCurrentProjectServiceTypeId").val(),'T',function(){
				ajaxGetService($("#inputProjectServiceType"),$("#inputProjectService"),$("#inputCurrentProjectServiceId").val(),'T');
			});
		}

		//Table Project Activity
		var bpkDataTableProjectActivity=$('#project-activity-datatable').dataTable({
			"bFilter": false,
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	      { 	"mData" : null, "sClass": "right" },
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.project_activity_type_detail;
					}
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+employeeViewUrl+'/'+full.actor_emp_id+'" rel="tooltip" data-title="View">'+full.actor+'</a>';
					}
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.create_date;
					}
				}
	    ],
	    "aaSorting": [[ 3, "desc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl_ProjectActivity,
			"sServerMethod": "POST",
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		//Table Project Task
		var bpkDataTableProjectTask=$('#project-task-datatable').dataTable({
			"bFilter": false,
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	      { 
	        "mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {	
						if(full.task_status_id!=1){		
							return '<input type="checkbox" name="inputDTCheckbox[]" class="dt-checkbox disabled" disabled/>';
						}
						else{
							return '<input type="checkbox" name="inputDTCheckbox[]" class="dt-checkbox" value="'+full.task_id+'" />';
						}
					}
				},
				{		"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.computed_order;
					}
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.task_id;
					}
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.task_title;
					}
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						if(full.parent_task_id==null) return "";
						return '<a target="_blank" href="'+taskViewUrl+'/'+full.parent_task_id+'" rel="tooltip" data-title="View">'+full.parent_task_id+'</a>';
					}
				},
	      { 	"mData" : null, "sClass" : "center",
					"mRender": function ( data, type, full ) {
						return full.task_status_detail;
					}
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						if(full.plan_start_date==null){
							return "";
						}
						return full.plan_start_date+" ถึง "+full.plan_end_date;
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.create_date;
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.incharge_emp_id!=null && full.incharge_emp_id!=""){
							return '<a target="_blank" href="'+employeeViewUrl+'/'+full.incharge_emp_id+'" rel="tooltip" data-title="View">'+full.incharge_emp_name+'</a>';
						}
						else return "";
					}
				},
	      { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.attachment_count>0){
							return '<i class="icon-file"></i>';
						}
						else{
							return '';
						}
					}
				},
	      { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(canEditTask){
							return '<a target="_blank" href="'+taskViewUrl+'/'+full.task_id+'" class="btn btn-primary margin-right3" rel="tooltip" data-title="View"><i class="icon-search icon-white"></i></a>'
							+'<button onclick="upTaskOrder(\''+full.task_id+'\',$(\'#project-task-datatable\'));" class="btn '+(full.task_order=="1"?'':'btn-success')+' margin-right3 '+(full.task_order=="1"?'disabled':'')+'" rel="tooltip" data-title="Up"><i class="icon-arrow-up icon-white"></i></button>'
							+'<button onclick="downTaskOrder(\''+full.task_id+'\',$(\'#project-task-datatable\'));" class="btn '+(full.is_max_task_order=="1"?'':'btn-danger')+' margin-right3 '+(full.is_max_task_order=="1"?'disabled':'')+'" rel="tooltip" data-title="Down"><i class="icon-arrow-down icon-white"></i></button>';
						}
						else{
							return '<a target="_blank" href="'+taskViewUrl+'/'+full.task_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="icon-search icon-white"></i></a>';
						}
					}
				}
	    ],
	    "aaSorting": [[ 0, "asc" ]],
			"bProcessing": true,
			"bServerSide": false,
			"aaData": null,
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings,false,true,'1');
				initDTCheckbox("project-task-datatable",onDTCheckboxChangeFunction);
			}
		});
		
		if($('#project-task-datatable').size()>0){
			getDatatableDataForProjectTask=function(){
				$.ajax({
				  type: 'POST',
				  url: dataTableAjaxSourceUrl_ProjectTask,
				  data: {},
				  beforeSend: showPageLoading,
				  success: function(data) {
				 		$('#project-task-datatable').dataTable().fnClearTable();
						$('#project-task-datatable').dataTable().fnAddData(data.aaData);
						// var tmpDataList=data.aaData;
						// dataList=new Array();
						// for(var i in tmpDataList){
						// 	dataList[tmpDataList[i].refno]=tmpDataList[i];
						// }
					},
				  dataType: "json",
				  async:false,
				  complete: hidePageLoading
				});	
			};

			getDatatableDataForProjectTask();
		}

		var projectCalendar=$('#calendar').fullCalendar({
			theme: true,
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
			height: 450,
			editable: false,
			events:function (start,end,callback){			
				var emp_id=$("#inputCalendarSelectEmp").val();
				var project_id=$("#inputCalendarProjectId").val();
				showPageLoading();
				$.post(ajaxProjectCalendarUrl, { "start":ISODateString(start),"end":ISODateString(end)
					,"project_id":project_id
					,"emp_id":emp_id
					,"viewType":$("input[name=inputCalendarSelectViewType]:checked").val()
					,"checkboxPlanToPlan":$("#calendarCheckboxPlanToPlan").is(":checked")
					,"checkboxPlanToFinish":$("#calendarCheckboxPlanToFinish").is(":checked")
					,"checkboxAcceptToFinish":$("#calendarCheckboxAcceptToFinish").is(":checked")}, function(data) {
					callback(data.events);
				},"json").always(function() {
					hidePageLoading();
				});
			},
			eventMouseover: function(event, jsEvent, view) {
			  $('.fc-event-inner', this).append('<div id=\"'+event.id+'\" class=\"hover-end\">งาน '+event.title+' (ใบบันทึก '+event.project_title+')</div>');
			},
			eventMouseout: function(event, jsEvent, view) {
			  $('#'+event.id).remove();
			},
			eventClick: function(event, jsEvent, view) {
				window.open(taskViewUrl+"/"+event.task_id);
	    }
		});

		$("#section-project-calendar").addClass('tab-pane');

		$("#inputCalendarSelectEmp,input[name=inputCalendarSelectViewType], #calendarCheckboxPlanToPlan, #calendarCheckboxPlanToFinish, #calendarCheckboxAcceptToFinish").change(function(){
			projectCalendar.fullCalendar('refetchEvents');
		});
	});
}
//end project


//new task
function validateNewTaskForm(){
	var passValidate=true;
	//check input bottom up
	if($("#inputTaskDateEnd").val()!=""){
		passValidate=checkInputTypeDateBetween($("#inputTaskDateStart"),$("#inputTaskDateEnd")) && passValidate;
	}
	if($("#inputEmployeeId").val()!=""){
		passValidate=checkInputTypeSelect($("#inputTaskService")) && passValidate;
		passValidate=checkInputTypeSelect($("#inputTaskServiceType")) && passValidate;
		passValidate=checkInputTypeSelect($("#inputRequestType")) && passValidate;
	}
	passValidate=checkInputTypeText($("#inputTaskTitle"),3) && passValidate;

	return passValidate;
}
if(viewName=="project-newtask"){
	$(function(){
		var inputServiceElem=$("select#inputTaskService");
		inputServiceElem.change(function(){
			var detail=inputServiceElem.find('option[value='+$(this).val()+']').attr('attr-detail-template');
			if(detail!=null && detail!=""){
				$("#inputTaskDescription").val(detail);
			}
		});

		$("#inputRequestType").change(function(){		
			ajaxGetServiceType($("#inputRequestType"),$("#inputInChargeEmpSectionId"),$("#inputTaskServiceType"),null,'T',function(){
				ajaxGetService($("#inputTaskServiceType"),$("#inputTaskService"),null,'T');
			});
		});
		$("#inputTaskServiceType").change(function(){		
			ajaxGetService($("#inputTaskServiceType"),$("#inputTaskService"),null,'T');
		});
		$("#inputTaskServiceType").change(function(){
			ajaxGetService($("#inputTaskServiceType"),$("#inputTaskService"));
		});

		ajaxGetServiceType($("#inputRequestType"),$("#inputInChargeEmpSectionId"),$("#inputTaskServiceType"),$("#inputProjectServiceTypeId").val(),'T',function(){
			ajaxGetService($("#inputTaskServiceType"),$("#inputTaskService"),$("#inputProjectServiceId").val(),'T');
		});
	});
}
//end new task


//task
function validateTaskForm(){
	var passValidate=true;
	//check input bottom up
	if($("#inputTaskDateEnd").val()!=""){
		passValidate=checkInputTypeDateBetween($("#inputTaskDateStart"),$("#inputTaskDateEnd")) && passValidate;
	}
	if($("#inputEmployeeId").val()!=""){
		passValidate=checkInputTypeSelect($("#inputTaskService")) && passValidate;
		passValidate=checkInputTypeSelect($("#inputTaskServiceType")) && passValidate;
		passValidate=checkInputTypeSelect($("#inputRequestType")) && passValidate;
	}

	passValidate=checkInputTypeHidden($("input[name=inputEmployeeId]"),$("input[name=inputEmployeeId]").siblings(".btn.select")) && passValidate;	

	if($("#inputTaskTitle").size()>0){
		passValidate=checkInputTypeText($("#inputTaskTitle"),3) && passValidate;
	}

	return passValidate;
}
function validateTaskActivityForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeSelect($("#inputTaskActionType")) && passValidate;

	return passValidate;
}
function checkTaskFileUploadLimit(elem){
	var sumSize=0;
	$('input.inputTaskAttachmentFile').each(function(){
		if(this.files!=null && this.files.length>0){
			sumSize+=this.files[0].size;
		}
	});
	if($("#inputCurrentTaskFileSize").size()>0){
		sumSize+=parseInt($("#inputCurrentTaskFileSize").val());
	}
	//minus removing file
	$('input.inputRemovingTaskAttachmentId').each(function(){
		if($(this).is(":checked")){
			sumSize-=parseInt($(this).attr('filesize'));
		}
	});

	if(sumSize>fileSizeUploadLimit*1024*1024){
		$(elem).closest('.fileupload').fileupload('clear');
		if($(elem).closest('.fileupload').next().hasClass('fileupload-last')){
			$(elem).closest('.fileupload').next().remove();
			$(elem).closest('.fileupload').addClass('fileupload-last');
		}
		alert("ไม่อนุญาตให้ขนาดไฟล์รวมกันเกิน "+fileSizeUploadLimit+" MB");
	}
}
if(viewName=="task-index"){
	$(function(){
		var inputServiceElem=$("select#inputTaskService");
		inputServiceElem.change(function(){
			var detail=inputServiceElem.find('option[value='+$(this).val()+']').attr('attr-detail-template');
			if(detail!=null && detail!=""){
				$("#inputTaskDescription").val(detail);
			}
		});

		$("#inputRequestType").change(function(){		
			ajaxGetServiceType($("#inputRequestType"),$("#inputInChargeEmpSectionId"),$("#inputTaskServiceType"),null,'T',function(){
				ajaxGetService($("#inputTaskServiceType"),$("#inputTaskService"),null,'T');
			});
		});
		$("#inputTaskServiceType").change(function(){		
			ajaxGetService($("#inputTaskServiceType"),$("#inputTaskService"),null,'T');
		});
		
		if($("#inputInChargeEmpSectionId").val()=="" && $("#inputProjectInchargeSectionId").size()>0){
			ajaxGetServiceType($("#inputRequestType"),$("#inputProjectInchargeSectionId"),$("#inputTaskServiceType"),$("#inputCurrentTaskServiceTypeId").val(),'T',function(){
				ajaxGetService($("#inputTaskServiceType"),$("#inputTaskService"),$("#inputCurrentTaskServiceId").val(),'T');
			});			
		}
		else{
			ajaxGetServiceType($("#inputRequestType"),$("#inputInChargeEmpSectionId"),$("#inputTaskServiceType"),$("#inputCurrentTaskServiceTypeId").val(),'T',function(){
				ajaxGetService($("#inputTaskServiceType"),$("#inputTaskService"),$("#inputCurrentTaskServiceId").val(),'T');
			});
		}

		var inputProblemTypeElem=$('select[attr-name^=inputTaskActionProblemType]');
		var inputProblemTopicElem=$('select[attr-name^=inputTaskActionProblemTopic]');
		var inputProblemDetailElem=$('textarea[name^=inputTaskActionDescription]');

		inputProblemTypeElem.change(function(){
			ajaxGetProblemTopicFromProblemType(inputProblemTypeElem,inputProblemTopicElem,null,null);
		});
		inputProblemTopicElem.change(function(){
			var detail=inputProblemTopicElem.find('option[value='+$(this).val()+']').attr('attr-detail-template');
			if(detail!=null && detail!=""){
				inputProblemDetailElem.val(detail);
			}
		});

		//Table Borrow
		var bpkDataTableBorrow=$('#borrow-datatable').dataTable({
			"bFilter": false,
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	      { 	"mData" : null, "sClass": "right" },
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+wsitemViewUrl+'/'+full.wsitem_id+'" rel="tooltip" data-title="View">'+full.wsitem_id+'</a>';
					}
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.hos_detail;
					} 
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.section_detail;
					} 
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.itemtype_detail;
					}
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.brand;
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.borrow_status;
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.create_date;
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.borrow_start_date.substring(0,10)+"<br/>ถึง<br/>"+full.borrow_end_date.substring(0,10);
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.accept_start_date==null){
							return "";
						}
						else{
							return full.accept_start_date.substring(0,10)+"<br/>ถึง<br/>"+full.accept_end_date.substring(0,10);
						}
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.return_date;
					}
				},
	      { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="'+borrowViewUrl+'/'+full.wsitem_borrow_id+'" target="_blank" class="btn btn-primary" rel="tooltip" data-title="ดูรายละเอียด"><i class="icon-search icon-white"></i></a>';
					}
				}
	    ],
	    "aaSorting": [[ 7, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl_Borrow,
			"sServerMethod": "POST",
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		//Table Task Activity
		var bpkDataTableTaskActivity=$('#task-activity-datatable').dataTable({
			"bFilter": false,
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.computed_order;
					}
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.task_activity_type_detail;
					}
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.problemtype_detail;
					} 
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.problem_topic_detail;
					} 
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						if(full.assigned_emp_id!=null){
							return '<a target="_blank" href="'+employeeViewUrl+'/'+full.assigned_emp_id+'" rel="tooltip" data-title="View">'+full.assigned_emp_name+'</a>';
						}
						return full.task_activity_detail;
					} 
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+employeeViewUrl+'/'+full.actor_emp_id+'" rel="tooltip" data-title="View">'+full.actor+'</a>';
					}
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.create_date;
					}
				}
	    ],
	    "aaSorting": [[ 6, "desc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl_TaskActivity,
			"sServerMethod": "POST",
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings,false);
			}
		});
	});
}
//end task

		
//select-project
function onSelectDataTableRow_Project(project_id,title){
	window.opener.focus();
	window.opener.selectProjectCallback(project_id,title);
 	window.close();
}

if(viewName=="select-project"){
	$("#inputHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,null,function(){		
			ajaxGetServiceType($("#inputRequestTypeId"),$("#inputSectionId"),$("#inputServiceTypeId"),null,null,function(){
				ajaxGetService($("#inputServiceTypeId"),$("#inputServiceId"),null,null);
			});
		});
	});

	$("#inputInformHospitalId_Project").change(function(){
		ajaxGetSectionFromHospital($("#inputInformHospitalId_Project"),$("#inputInformSectionId_Project"),null,'T');
	});
	$("#inputAcceptHospitalId_Project").change(function(){
		ajaxGetSectionFromHospital($("#inputAcceptHospitalId_Project"),$("#inputAcceptSectionId_Project"),null,'T');
	});

	$(document).ready(function() {
		//Table Project		
		var bpkDataTableProject=$('#project-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	      { 	"mData" : null, "sClass": "right" },
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.project_id;
					}
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.title;
					} 
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.request_type_detail;
					} 
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.inform_section_detail;
					}
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.accept_section_detail;
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.request_priority_id=="0"){
							return '<span class="label label-important">'+full.request_priority_detail+'</span>';
						}
						else{
							return '<span class="label label-info">'+full.request_priority_detail+'</span>';
						}						
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.inform_date;
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.project_status_detail;
					}
				},
	      { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {	
						return '<a target="_blank" href="'+projectViewUrl+'/'+full.project_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="icon-search icon-white"></i></a>';
					}
				},	 
	      { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="onSelectDataTableRow_Project(\''+full.project_id+'\',\''+full.title+'\')" class="btn btn-primary" rel="tooltip" data-title="Select"><i class="icon-ok icon-white"></i></a>';
					}
				}
	    ],
	    "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl_Project,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
			      aoData.push( { "name": "project_id", "value": $("#inputProjectId_Project").val() } );
			      aoData.push( { "name": "title", "value": $("#inputTitle_Project").val() } );
			      aoData.push( { "name": "request_type_id", "value": $("#inputRequestType_Project").val() } );
			      aoData.push( { "name": "inform_section_id", "value": $("#inputInformSectionId_Project").val() } );
			      aoData.push( { "name": "accept_section_id", "value": $("#inputAcceptSectionId_Project").val() } );
			      aoData.push( { "name": "request_priority_id", "value": $("#inputRequestPriority_Project").val() } );
			      aoData.push( { "name": "project_status_id", "value": $("#inputProjectStatus_Project").val() } );
			      aoData.push( { "name": "inform_date_start", "value": $("#inputInformDateStart_Project").val() } );
			      aoData.push( { "name": "inform_date_end", "value": $("#inputInformDateEnd_Project").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTableProject.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-project-submit").click(function(){
			bpkDataTableSearchSubmit(bpkDataTableProject);
			return false;
		});
	});
}
//end select-project


//select-template
function onSelectDataTableRow_Template(template_project_id,title){
	window.opener.focus();
	window.opener.selectTemplateCallback(template_project_id,title);
 	window.close();
}

if(viewName=="select-template"){
	$("#inputHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,null,function(){		
			ajaxGetServiceType($("#inputRequestTypeId"),$("#inputSectionId"),$("#inputServiceTypeId"),null,null,function(){
				ajaxGetService($("#inputServiceTypeId"),$("#inputServiceId"),null,null);
			});
		});
	});
	$("#inputSectionId, #inputRequestTypeId").change(function(){		
		ajaxGetServiceType($("#inputRequestTypeId"),$("#inputSectionId"),$("#inputServiceTypeId"),null,null,function(){
			ajaxGetService($("#inputServiceTypeId"),$("#inputServiceId"),null,null);
		});
	});
	$("#inputServiceTypeId").change(function(){		
		ajaxGetService($("#inputServiceTypeId"),$("#inputServiceId"),null,null);
	});

	$(document).ready(function() {
		bpkDataTable=$('#select-template').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.title;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.service_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.servicetype_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.request_type_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.hos_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.section_detail;
					}
				},
	            { 	"mData" : null, "sClass": "right",
					"mRender": function ( data, type, full ) {
						return full.count_task;
					}
				},
				{ 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+templateViewUrl+'/'+full.template_project_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="icon-search icon-white"></i></a>';
					}
				},	 
	             { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="onSelectDataTableRow_Template(\''+full.template_project_id+'\',\''+full.title+'\')" class="btn btn-primary" rel="tooltip" data-title="Select"><i class="icon-ok icon-white"></i></a>';
					}
				}
	        ],
	        "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
				aoData.push( { "name": "template_title", "value": $("#inputTemplateTitle").val() } );
				aoData.push( { "name": "service_id", "value": $("#inputServiceId").val() } );
				aoData.push( { "name": "servicetype_id", "value": $("#inputServiceTypeId").val() } );
				aoData.push( { "name": "request_type_id", "value": $("#inputRequestTypeId").val() } );
				aoData.push( { "name": "hos_id", "value": $("#inputEmpHospital").val() } );
				aoData.push( { "name": "section_id", "value": $("#inputSectionId").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-template-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	});
}
//end select-template


//select-wsitem
function onSelectDataTableRow_WsItem(itemtype_detail,wsitem_id,brand,serial,ws_id,model,hos_detail,section_detail){
	window.opener.focus();
	window.opener.selectWsItemCallback(itemtype_detail,wsitem_id,brand,serial,ws_id,model,hos_detail,section_detail);
 	window.close();
}

if(viewName=="select-wsitem"){
	$("#inputHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,'T');
	});
	$(document).ready(function() {
		bpkDataTable=$('#select-wsitem').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.wsitem_id;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.ws_id;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.hos_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.section_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.itemtype_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.brand;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.model;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.serial;
					}
				},
	      { "mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
					return '<a target="_blank" href="'+wsitemViewUrl+'/'+full.wsitem_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="icon-search icon-white"></i></a>';
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="onSelectDataTableRow_WsItem(\''+full.itemtype_detail+'\',\''+full.wsitem_id+'\',\''+full.brand+'\',\''+full.serial+'\',\''+full.ws_id+'\',\''+full.model+'\',\''+full.section_detail+'\',\''+full.hos_detail+'\')" class="btn btn-primary" rel="tooltip" data-title="Select"><i class="icon-ok icon-white"></i></a>';
					}
				}
	        ],
	        "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
				aoData.push( { "name": "wsitem_id", "value": $("#inputItemId").val() } );
				aoData.push( { "name": "ws_id", "value": $("#inputWsId").val() } );
				aoData.push( { "name": "hos_id", "value": $("#inputEmpHospital").val() } );
				aoData.push( { "name": "section_id", "value": $("#inputSectionId").val() } );     
				aoData.push( { "name": "itemtype_detail", "value": $("#inputItemTypeDetail").val() } );
				aoData.push( { "name": "brand", "value": $("#inputItemBrand").val() } );
				aoData.push( { "name": "model", "value": $("#inputItemModel").val() } );
				aoData.push( { "name": "serial", "value": $("#inputItemSerial").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-item-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	});
}
//end select-wsitem


//select-employee
function onSelectDataTableRow_Employee(emp_id,emp_name,hos_detail,section_detail,position,section_id){
	window.opener.focus();
	window.opener.selectEmployeeCallback(emp_id,emp_name,hos_detail,section_detail,position,section_id);
 	window.close();
}

if(viewName=="select-employee"){
	$("#inputHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,null);
	});

	$(document).ready(function() {
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,null);

		bpkDataTable=$('#select-employee-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": 
			[
				{ 	"mData" : null, "sClass": "right" },
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.emp_id;
				} 
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.ename+" "+full.esurname;
				}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.hos_detail;
				}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.section_detail;
				} 
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.position;
				} 
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return getUserLevel(full.level);
				}
				},
	      { "mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
					return '<a target="_blank" href="'+employeeViewUrl+'/'+full.emp_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="icon-search icon-white"></i></a>';
					}
				},
				{ 	"mData" : null , "sClass": "center",
				"mRender": function ( data, type, full ) {
				return '<a href="#" onclick="onSelectDataTableRow_Employee(\''+full.emp_id+'\',\''+full.ename+' '+full.esurname+'\',\''+full.hos_detail+'\',\''+full.section_detail+'\',\''+full.position+'\',\''+full.section_id+'\')" class="btn btn-primary" rel="tooltip" data-title="Select"><i class="icon-ok icon-white"></i></a>';
				}
				}
			],
			"aaSorting": [[ 2, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
	      aoData.push( { "name": "ename", "value": $("#inputEmpName").val() } );
	      aoData.push( { "name": "esurname", "value": $("#inputEmpSurname").val() } );
	      aoData.push( { "name": "emp_id", "value": $("#inputEmpId").val() } );
				aoData.push( { "name": "hos_id", "value": $("#inputHospitalId").val() } );
				aoData.push( { "name": "section_id", "value": $("#inputSectionId").val() } ); 
	      aoData.push( { "name": "position", "value": $("#inputEmpPosition").val() } );
	      aoData.push( { "name": "level", "value": $("#inputEmpLevel").val() } );
	      aoData.push( { "name": "isworking", "value": $("#inputEmpStatus").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-employee-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	});
}
//end select-employee


//template-view
if(viewName=="template-view"){

	$(document).ready(function() {
		//Table Template Task
		var bpkDataTableTemplateTask=$('#template-task-datatable').dataTable({
			"bFilter": false,
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.computed_order;
					}
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.task_title;
					}
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						if(full.parent_task_id==null) return "";
						return '<a target="_blank" href="'+templateTaskViewUrl+'/'+full.parent_task_id+'" rel="tooltip" data-title="View">'+full.parent_template_task_title+'</a>';
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.create_date;
					}
				},
	      { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+templateTaskViewUrl+'/'+full.task_id+'" class="btn btn-primary margin-right3" rel="tooltip" data-title="View"><i class="icon-search icon-white"></i></a>';
					}
				}
	    ],
	    "aaSorting": [[ 0, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl_TemplateTask,
			"sServerMethod": "POST",
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings,false);
			}
		});
	});
}
//end template-view


//employee-changepass
function validateEmployeeChangePassword(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputOldPassword]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputNewPassword]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputNewPasswordConfirm]")) && passValidate;
	
	if(passValidate){
		if($("input[name=inputNewPassword]").val()!=$("input[name=inputNewPasswordConfirm]").val()){
			updateInputErrMsg("รหัสผ่านไม่ตรงกัน",$("input[name=inputNewPassword]"));
			updateInputErrMsg("รหัสผ่านไม่ตรงกัน",$("input[name=inputNewPasswordConfirm]"));
			passValidate=false;
		}
		if(passValidate){
			$.ajax({
			  type: 'POST',
			  url: ajaxCheckEmpPassUrl,
			  data: {"inputOldPassword":$("input[name=inputOldPassword]").val()},
			  success: function(data) {
					if(data.result!="OK"){
						updateInputErrMsg("รหัสผ่านเดิมไม่ถูกต้อง",$("input[name=inputOldPassword]"));
						passValidate=false;
					}
				},
			  dataType: "json",
			  async:false
			});
		}
	}

	return passValidate;
}
//end employee-changepass

//admin-select-document
function onSelectDataTableRow_Document(doc_id,doc_name,file_name,file_size){
	window.opener.focus();
	window.opener.selectDocumentCallback(doc_id,doc_name,file_name,file_size);
 	window.close();
}

if(viewName=="admin-select-document"){
	$("#inputEmpHospital").change(function(){
		ajaxGetSectionFromHospital($("#inputEmpHospital"),$("#inputSectionId"),null,null);
	});

	$(document).ready(function() {

		bpkDataTable=$('#admin-select-document-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": 
			[
				{ 	"mData" : null, "sClass": "right" },
				{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
					return full.document_id;
				}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.document_name;
				} 
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.file_name;
				} 
				},
				{ 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
				return (full.file_size/1024/1024).formatMoney(2,'.',',');
				} 
				},
				{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
				return full.upload_date;
				}
				},
	      { "mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
					return '<a target="_blank" href="'+documentAdminViewUrl+'/'+full.document_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="icon-search icon-white"></i></a>';
					}
				},
				{ 	"mData" : null , "sClass": "center",
				"mRender": function ( data, type, full ) {
				return '<a href="#" onclick="onSelectDataTableRow_Document(\''+full.document_id+'\',\''+full.document_name+'\',\''+full.file_name+'\',\''+full.file_size+'\')" class="btn btn-primary" rel="tooltip" data-title="Select"><i class="icon-ok icon-white"></i></a>';
				}
				}
			],
			"aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
	      aoData.push( { "name": "document_id", "value": $("#inputDocumentId").val() } );
	      aoData.push( { "name": "document_name", "value": $("#inputDocumentName").val() } );
	      aoData.push( { "name": "file_name", "value": $("#inputFileName").val() } );      
	      aoData.push( { "name": "upload_date_start", "value": $("#inputDocumentUploadStart").val() } );
	      aoData.push( { "name": "upload_date_end", "value": $("#inputDocumentUploadEnd").val() } );
	      aoData.push( { "name": "create_by", "value": $("#inputCreateBy").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-document-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	});
}
//end admin-select-document


//admin-select-dms-document
function onSelectDataTableRow_DmsDocument(doc_id,doc_name,file_type,file_size){
	window.opener.focus();
	window.opener.selectDmsDocumentCallback(doc_id,doc_name,file_type,file_size);
 	window.close();
}

if(viewName=="admin-select-dms-document"){
	$("#inputHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,null);
	});

	$(document).ready(function() {
		bpkDataTable=$('#admin-select-dms-document-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
        { 	"mData" : null, "sClass": "right" },
        { 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
					return full.doc_id;
				}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.doc_name;
				} 
				},
				{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
				return full.file_type;
				} 
				},
        { 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
					return full.hos_detail;
				}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.section_detail;
				} 
				},
				{ 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
				return parseInt(full.page_count).formatMoney(0,'.',',');
				} 
				},
				{ 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
				return (full.file_size/1024/1024).formatMoney(2,'.',',');
				} 
				},
				{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
				return full.create_date;
				} 
				},
	      { "mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
					return '<a target="_blank" href="'+documentAdminDmsViewUrl+'/'+full.doc_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="icon-search icon-white"></i></a>';
					}
				},
				{ 	"mData" : null , "sClass": "center",
				"mRender": function ( data, type, full ) {
				return '<a href="#" onclick="onSelectDataTableRow_DmsDocument(\''+full.doc_id+'\',\''+full.doc_name+'\',\''+full.file_type+'\',\''+full.file_size+'\')" class="btn btn-primary" rel="tooltip" data-title="Select"><i class="icon-ok icon-white"></i></a>';
				}
				}
	     ],
	    "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
	      aoData.push( { "name": "hos_id", "value": $("#inputHospitalId").val() } );
	      aoData.push( { "name": "section_id", "value": $("#inputSectionId").val() } );
	      aoData.push( { "name": "doc_id", "value": $("#inputDocId").val() } );
	      aoData.push( { "name": "doc_name", "value": $("#inputDocName").val() } );
	      aoData.push( { "name": "file_type", "value": $("#inputFileType").val() } );
	      aoData.push( { "name": "create_date_start", "value": $("#inputCreateDateStart").val() } );
	      aoData.push( { "name": "create_date_end", "value": $("#inputCreateDateEnd").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-dms-document-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	});
}
//end admin-select-dms-document

//admin-employee-import
function adminEmployeeImportInitDatatable(data,pass_validate){
	if($('#import-datatable').hasClass('dataTable')){
		$('#import-datatable').dataTable().fnDestroy();
	}	

	var aaSorting=[];
	if(!pass_validate){
		aaSorting=[[ 10, "desc" ]];
	}

	$('#import-datatable').dataTable({
		"bJQueryUI": true,
		"sPaginationType": "full_numbers",
		"aoColumnDefs": dataTableCustomColumnDef,
		"aoColumns": [
            { 	"mData" : null, "sClass": "right" },
            { 	"mData" : null, "sClass": "right",
					"mRender": function ( data, type, full ) {
						return full.emp_id
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.ename+" "+full.esurname;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.password;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.hos_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.section_detail;
					} 
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.is_section_head;
					} 
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.position;
					} 
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return getUserLevel(full.level);
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.note;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.validate=="-ผ่าน-"){
							return '<span class="label label-success">'+full.validate+'</span>';
						}
						else{
							return '<span class="label label-important">'+full.validate+'</span>';
						}
					}
				}
			],
        "aaSorting": aaSorting,
		"bProcessing": true,
		"bServerSide": false,
		"aaData": data,
		"bFilter": false,
		"bInfo": false,
		"bPaginate": false,
		"sDom": 'lfrtip',
		"fnDrawCallback": function ( oSettings ) {
			bpkDataTableDrawCallback(oSettings,null,true,null,true);
		}
	});
}
function _submitAdminEmployeeImportForm(){
	var options = { 
      //target:        '#output2',   // target element(s) to be updated with server response 
      beforeSubmit:  function(){
      	showPageLoading();
      },  // pre-submit callback 
      success:       function(data){
      	if(data.error!=""){
					openModal("fail",data.error,false,null);
      	}
      	else{
      		if($("#inputSubmitType").val()=="validate"){
      			scrollToElem($("#import-datatable"));
      			adminEmployeeImportInitDatatable(data.data,data.pass_validate);
      		}
      		else if($("#inputSubmitType").val()=="submit"){
						alert("บันทึกสำเร็จ");
						window.location.href = employeeAdminIndexUrl;
      		}
      	}
      },
      complete: function(){
      	hidePageLoading();
      },
      type:      'post',        // 'get' or 'post', override for form's 'method' attribute 
      dataType:  'json',        // 'xml', 'script', or 'json' (expected server response type) 
      clearForm: false,        // clear all form fields after successful submit 
      resetForm: false         // reset the form after successful submit 

      // $.ajax options can be used here too, for example: 
      //timeout:   3000 
  }; 

  // bind to the form's submit event 
  $('#form-admin-import-employee').ajaxSubmit(options);
}
function submitAdminEmployeeImportForm(){
	$("#inputSubmitType").val("submit");
	_submitAdminEmployeeImportForm();
}
function validateAdminEmployeeImportFile(){
	$("#inputSubmitType").val("validate");
	_submitAdminEmployeeImportForm();
}
if(viewName=="admin-employee-import"){
	adminEmployeeImportInitDatatable(new Array());
}

//admin-employee-add
function validateAdminEmployeeAddForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeSelect($("select[id=inputSectionId]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputPasswordConfirm]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputPassword]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputEmpSurname]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputEmpName]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputEmpId]")) && passValidate;

	if(passValidate){
		if($("input[name=inputPassword]").val()!=$("input[name=inputPasswordConfirm]").val()){
			updateInputErrMsg("รหัสผ่านไม่ตรงกัน",$("input[name=inputPassword]"));
			updateInputErrMsg("รหัสผ่านไม่ตรงกัน",$("input[name=inputPasswordConfirm]"));
			passValidate=false;
		}
		$.ajax({
		  type: 'POST',
		  url: ajaxIsEmpIdExistUrl,
		  data: {"empId":$("input[name=inputEmpId]").val()},
		  success: function(data) {
				if(data.exist){
					updateInputErrMsg("รหัส "+$("input[name=inputEmpId]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputEmpId]"));
					passValidate=false;
				}
			},
		  dataType: "json",
		  async:false
		});
	}
	return passValidate;
}
if(viewName=="admin-employee-add"){
	$("#inputEmpHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputEmpHospitalId"),$("#inputSectionId"),null,'T',function(){
			ajaxGetServicePoint($("#inputSectionId"),$("#inputServicePointId"),null,'T');			
		});
	});

	$("#inputSectionId").change(function(){
		ajaxGetServicePoint($("#inputSectionId"),$("#inputServicePointId"),null,'T');
	});
}
//end admin-employee-add

//admin-employee-edit
function validateAdminEmployeeEditForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeSelect($("select[id=inputSectionId]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputEmpSurname]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputEmpName]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputEmpId]")) && passValidate;
	
	if(passValidate){
		if($("input[name=inputPassword]").val()!=$("input[name=inputPasswordConfirm]").val()){
			updateInputErrMsg("รหัสผ่านไม่ตรงกัน",$("input[name=inputPassword]"));
			updateInputErrMsg("รหัสผ่านไม่ตรงกัน",$("input[name=inputPasswordConfirm]"));
			passValidate=false;
		}
		if($("input[name=inputEmpId]").val()!=$("input[name=inputOldEmpId]").val()){
			$.ajax({
			  type: 'POST',
			  url: ajaxIsEmpIdExistUrl,
			  data: {"empId":$("input[name=inputEmpId]").val()},
			  success: function(data) {
					if(data.exist){
						updateInputErrMsg("รหัส "+$("input[name=inputEmpId]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputEmpId]"));
						passValidate=false;
					}
				},
			  dataType: "json",
			  async:false
			});
		}
	}

	return passValidate;
}
if(viewName=="admin-employee-edit"){
	$("#inputEmpHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputEmpHospitalId"),$("#inputSectionId"),null,'T',function(){
			ajaxGetServicePoint($("#inputSectionId"),$("#inputServicePointId"),null,'T');			
		});
	});
	$("#inputSectionId").change(function(){
		ajaxGetServicePoint($("#inputSectionId"),$("#inputServicePointId"),null,'T');
	});

	ajaxGetSectionFromHospital($("#inputEmpHospitalId"),$("#inputSectionId"),$("input[name=inputOldSectionId]").val(),'T',function(){
		ajaxGetServicePoint($("#inputSectionId"),$("#inputServicePointId"),$("input[name=inputOldServicePointId]").val(),'T');			
	});
	
	$(document).on("change","input[name^=inputHospital]",function(){
		var inputSectionElem=$(this).parent().siblings("select.inputSectionId");
		var inputServicePointElem=$(this).parent().siblings("select.inputServicePointId");
		ajaxGetSectionFromHospital($(this),$(this).parent().siblings("select.inputSectionId"),null,'T',function(){
			ajaxGetServicePoint(inputSectionElem,inputServicePointElem,null,'T');						
		});
	});
	$(document).on("change","input[name^=inputEmpSectionId]",function(){
		var inputServicePointElem=$(this).parent().siblings("select.inputServicePointId");
		ajaxGetServicePoint($(this),inputServicePointElem,null,'T');
	});
}
//end admin-employee-edit
//admin-employee
function enableEmployee(emp_id,dataTable){
	showPageLoading();
	$.post(employeeAdminEnableUrl, {"emp_id":emp_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","พนักงานที่เลือกถูกเปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function disableEmployee(emp_id,dataTable){
	showPageLoading();
	$.post(employeeAdminDisableUrl, {"emp_id":emp_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","พนักงานที่เลือกถูกปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function deleteEmployee(emp_id,emp_name,dataTable){
	openModal("ยืนยันการลบ","ยืนยันการลบพนักงาน "+emp_name+"?",true,function(){
		showPageLoading();
		$.post(employeeAdminDeleteUrl, {"emp_id":emp_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","พนักงานถูกลบเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
function resetEmployeePassword(emp_id,emp_name){
	openModal("ยืนยันการ reset password","ยืนยันการ reset password ของพนักงาน "+emp_name+"?",true,function(){
		showPageLoading();
		$.post(employeeAdminResetPasswordUrl, {"emp_id":emp_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","Reset Password ของพนักงานเรียบร้อย",false,null);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
if(viewName=="admin-employee-index"){	
	$("#inputEmpHospital").change(function(){
		ajaxGetSectionFromHospital($("#inputEmpHospital"),$("#inputSectionId"),null,null);
	});

	$("#inputEmpHospital").val(userHosId);
	ajaxGetSectionFromHospital($("#inputEmpHospital"),$("#inputSectionId"),userSectionId,'T',function(){ functionInitTableEmp(); });


	$("#inputEmpHospital").closest("form").on('reset',function() {
		setTimeout(function(){
			ajaxGetSectionFromHospital($("#inputEmpHospital"),$("#inputSectionId"),null,null);
	  },100);
	});

	var functionInitTableEmp=function(){
		bpkDataTable=$('#admin-employee-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.emp_id;
					} 
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.ename+" "+full.esurname;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.section_detail;
					} 
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.position;
					} 
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						if(full.level!=null && full.level!=""){
							return getUserLevel(full.level);
						}
						else{
							return '';
						}
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.isworking=='T'){
							return '<span class="label label-success">ใช้งาน</span>';
						}
						else{
							return '<span class="label label-important">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+employeeViewUrl+'/'+full.emp_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="icon-search icon-white"></i></a>';
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="'+employeeAdminEditUrl+'/'+full.emp_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="icon-wrench icon-white"></i></a>';
					}
				},
	            {
	            	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						var returnHtml= '<div class="btn-group">'
			            		+'<a class="btn-more btn btn-info dropdown-toggle" data-toggle="dropdown" href="#">'
			            		+'	More'
			            		+'	<span class="caret"></span>'
			            		+'</a>'
			            		+'<ul class="dropdown-menu">'
			            		+'	<li>';
			            if(full.isworking=="T"){
			            	returnHtml+='<a href="#" onclick="disableEmployee(\''+full.emp_id+'\',$(\'#admin-employee-datatable\')); return false;"><span>ไม่ใช้งาน</span></a>';
			            }
			            else{
			            	returnHtml+='<a href="#" onclick="enableEmployee(\''+full.emp_id+'\',$(\'#admin-employee-datatable\')); return false;"><span>ใช้งาน</span></a>';
			            }
			            returnHtml+='</li>'
			            returnHtml+='<li><a href="#" onclick="resetEmployeePassword(\''+full.emp_id+'\',\''+full.ename+' '+full.esurname+'\'); return false;"><span>Reset Password</span></a></li>';
			            returnHtml+='<li><a href="#" onclick="deleteEmployee(\''+full.emp_id+'\',\''+full.ename+' '+full.esurname+'\',$(\'#admin-employee-datatable\')); return false;"><span>ลบ</span></a></li>';
			            returnHtml+='<li><a href="'+base_url+'admin/employee/qr_code/'+full.emp_id+'" target="_blank"><span>พิมพ์ QR</span></a></li>';
			            		+'</ul>'
			            	+'</div>';
			            return returnHtml;
					}
	            }
	        ],
	        "aaSorting": [[ 2, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
			      aoData.push( { "name": "ename", "value": $("#inputEmpName").val() } );
			      aoData.push( { "name": "esurname", "value": $("#inputEmpSurname").val() } );
			      aoData.push( { "name": "emp_id", "value": $("#inputEmpId").val() } );
			      aoData.push( { "name": "section_id", "value": $("#inputSectionId").val() } );
			      aoData.push( { "name": "position", "value": $("#inputEmpPosition").val() } );
			      aoData.push( { "name": "hos_id", "value": $("#inputEmpHospital").val() } );
			      aoData.push( { "name": "level", "value": $("#inputEmpLevel").val() } );
			      aoData.push( { "name": "isworking", "value": $("#inputEmpStatus").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-employee-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	};
}
//end admin-employee


//admin-empgroup-add
function validateAdminEmpGroupAddForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputEmpGroupName]")) && passValidate;

	return passValidate;
}
if(viewName=="admin-empgroup-add"){
}
//end admin-empgroup-add

//admin-empgroup-edit
function validateAdminEmpGroupEditForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputEmpGroupName]")) && passValidate;
	
	return passValidate;
}
function deleteEmpToEmpGroup(emp_to_emp_group_id,efullname,dataTable){
	openModal("ยืนยันการลบ","ยืนยันการลบพนักงาน "+efullname+" ออกจากกลุ่ม?",true,function(){
		showPageLoading();
		$.post(empToEmpGroupAdminDeleteUrl, {"emp_to_emp_group_id":emp_to_emp_group_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","พนักงานถูกลบออกจากกลุ่มเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
if(viewName=="admin-empgroup-edit"){
	$(document).ready(function() {		
		bpkDataTable=$('#empgroup-emp-datatable').dataTable({
			"bFilter": false,
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	      { 	"mData" : null, "sClass": "right" },
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.ename+" "+full.esurname;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.hos_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.section_detail;
					} 
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+employeeViewUrl+'/'+full.emp_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="icon-search icon-white"></i></a>';
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="deleteEmpToEmpGroup(\''+full.emp_to_emp_group_id+'\',\''+full.ename+' '+full.esurname+'\',$(\'#empgroup-emp-datatable\')); return false;" class="btn btn-primary" rel="tooltip" data-title="Remove"><i class="icon-trash icon-white"></i></a>';
					}
				}
	    ],
	    "aaSorting": [[ 0, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl_Emp,
			"sServerMethod": "POST",
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});
	});
}
//end admin-empgroup-edit

//admin-empgroup
function enableEmpGroup(emp_group_id,dataTable){
	showPageLoading();
	$.post(empGroupAdminEnableUrl, {"emp_group_id":emp_group_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","กลุ่มพนักงานที่เลือกถูกเปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function disableEmpGroup(emp_group_id,dataTable){
	showPageLoading();
	$.post(empGroupAdminDisableUrl, {"emp_group_id":emp_group_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","กลุ่มพนักงานที่เลือกถูกปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function deleteEmpGroup(emp_group_id,emp_group_name,dataTable){
	openModal("ยืนยันการลบ","ยืนยันการลบกลุ่มพนักงาน "+emp_group_name+"?",true,function(){
		showPageLoading();
		$.post(empGroupAdminDeleteUrl, {"emp_group_id":emp_group_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","กลุ่มพนักงานถูกลบเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
if(viewName=="admin-empgroup-index"){	
	$(document).ready(function() {
		bpkDataTable=$('#admin-empgroup-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	      { 	"mData" : null, "sClass": "right" },
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.name;
					}
				},
				{ "mData" : null, "sClass": "right",
					"mRender": function ( data, type, full ) {
						return full.count_emp;
					}
				},
	     	{ "mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.isused=='T'){
							return '<span class="label label-success">ใช้งาน</span>';
						}
						else{
							return '<span class="label label-important">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+empGroupAdminEditUrl+'/'+full.emp_group_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="icon-wrench icon-white"></i></a>';
					}
				},
	            {
	            	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						var returnHtml= '<div class="btn-group">'
			            		+'<a class="btn-more btn btn-info dropdown-toggle" data-toggle="dropdown" href="#">'
			            		+'	More'
			            		+'	<span class="caret"></span>'
			            		+'</a>'
			            		+'<ul class="dropdown-menu">'
			            		+'	<li>';
			            if(full.isused=="T"){
			            	returnHtml+='<a href="#" onclick="disableEmpGroup(\''+full.emp_group_id+'\',$(\'#admin-empgroup-datatable\')); return false;"><span>ไม่ใช้งาน</span></a>';
			            }
			            else{
			            	returnHtml+='<a href="#" onclick="enableEmpGroup(\''+full.emp_group_id+'\',$(\'#admin-empgroup-datatable\')); return false;"><span>ใช้งาน</span></a>';
			            }
			            returnHtml+='</li>'
			            returnHtml+='<li><a href="#" onclick="deleteEmpGroup(\''+full.emp_group_id+'\',\''+full.name+'\',$(\'#admin-empgroup-datatable\')); return false;"><span>ลบ</span></a></li>';
			            		+'</ul>'
			            	+'</div>';
			            return returnHtml;
					}
	            }
	        ],
	        "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
			      aoData.push( { "name": "name", "value": $("#inputEmpGroupName").val() } );
			      aoData.push( { "name": "isused", "value": $("#inputEmpGroupStatus").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-empgroup-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	});
}
//end admin-empgroup


//admin-servicetype-add
function validateAdminServiceTypeAddForm(){
	var passValidate=true;

	$("input[name=inputServiceTypeDetail]").val($.trim($("input[name=inputServiceTypeDetail]").val()));

	//check input bottom up
	passValidate=checkInputTypeSelect($("select[name=inputSectionId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[name=inputEmpHospitalId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[name=inputRequestTypeId]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputServiceTypeDetail]")) && passValidate;

	if(passValidate){
		$.ajax({
		  type: 'POST',
		  url: ajaxIsServiceTypeExistUrl,
		  data: {"section_id":$("input[name=inputSectionId]").val()
		  	,"request_type_id":$("select[name=inputRequestTypeId]").val()
		  	,"detail":$("input[name=inputServiceTypeDetail]").val()},
		  success: function(data) {
				if(data.exist){
					updateInputErrMsg($("input[name=inputServiceTypeDetail]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputServiceTypeDetail]"));
					passValidate=false;
				}
			},
		  dataType: "json",
		  async:false
		});
	}

	return passValidate;
}
if(viewName=="admin-servicetype-add"){
	$("#inputEmpHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputEmpHospitalId"),$("#inputSectionId"),null,null);
	});
}
//end admin-servicetype-add

//admin-servicetype-edit
function validateAdminServiceTypeEditForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeSelect($("select[name=inputSectionId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[name=inputEmpHospitalId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[name=inputRequestTypeId]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputServiceTypeDetail]")) && passValidate;

	return passValidate;
}
if(viewName=="admin-servicetype-edit"){
	$("#inputEmpHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputEmpHospitalId"),$("#inputSectionId"),null,null);
	});
	ajaxGetSectionFromHospital($("#inputEmpHospitalId"),$("#inputSectionId"),$("input[name=inputOldSectionId]").val(),null,null);
}
//end admin-servicetype-edit

//admin-servicetype
function enableServiceType(servicetype_id,dataTable){
	showPageLoading();
	$.post(servicetypeAdminEnableUrl, {"servicetype_id":servicetype_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ประเภทบริการที่เลือกถูกเปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function disableServiceType(servicetype_id,dataTable){
	showPageLoading();
	$.post(servicetypeAdminDisableUrl, {"servicetype_id":servicetype_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ประเภทบริการที่เลือกถูกปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function deleteServiceType(servicetype_id,servicetype_detail,dataTable){
	openModal("ยืนยันการลบ","ยืนยันการลบประเภทบริการ "+servicetype_detail+"?",true,function(){
		showPageLoading();
		$.post(servicetypeAdminDeleteUrl, {"servicetype_id":servicetype_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","ประเภทบริการถูกลบเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
if(viewName=="admin-servicetype-index"){
	$("#inputHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,null);
	});

	ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),userSectionId,'T',function(){ functionInitTable(); });

	$("#inputHospitalId").closest("form").on('reset',function() {
		setTimeout(function(){
			ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,null);
	  },100);
	});

	var functionInitTable=function(){
		bpkDataTable=$('#admin-servicetype-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.request_type_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.hos_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.section_detail;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.isused=='T'){
							return '<span class="label label-success">ใช้งาน</span>';
						}
						else{
							return '<span class="label label-important">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+servicetypeAdminEditUrl+'/'+full.servicetype_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="icon-wrench icon-white"></i></a>';
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="deleteServiceType(\''+full.servicetype_id+'\',\''+full.detail+'\',$(\'#admin-servicetype-datatable\')); return false;" class="btn btn-danger" rel="tooltip" data-title="ลบ"><i class="icon-trash icon-white"></i></a>';
					}
				},
	            {
	            	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						var returnHtml= '<div class="btn-group">'
			            		+'<a class="btn-more btn btn-info dropdown-toggle" data-toggle="dropdown" href="#">'
			            		+'	More'
			            		+'	<span class="caret"></span>'
			            		+'</a>'
			            		+'<ul class="dropdown-menu">'
			            		+'	<li>';
			            if(full.isused=="T"){
			            	returnHtml+='<a href="#" onclick="disableServiceType(\''+full.servicetype_id+'\',$(\'#admin-servicetype-datatable\')); return false;"><span>ไม่ใช้งาน</span></a>';
			            }
			            else{
			            	returnHtml+='<a href="#" onclick="enableServiceType(\''+full.servicetype_id+'\',$(\'#admin-servicetype-datatable\')); return false;"><span>ใช้งาน</span></a>';
			            }
			            returnHtml+='</li>'
			            		+'</ul>'
			            	+'</div>';
			            return returnHtml;
					}
	            }
	        ],
	        "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
				aoData.push( { "name": "detail", "value": $("#inputServiceTypeDetail").val() } );
				aoData.push( { "name": "request_type_id", "value": $("#inputRequestTypeId").val() } );
				aoData.push( { "name": "hos_id", "value": $("#inputHospitalId").val() } );
				aoData.push( { "name": "section_id", "value": $("#inputSectionId").val() } );
				aoData.push( { "name": "isused", "value": $("#inputServiceTypeStatus").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-servicetype-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	};
}
//end admin-servicetype


//admin-service-add
function validateAdminServiceAddForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeSelect($("select[id=inputServiceTypeId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[id=inputSectionId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[name=inputEmpHospitalId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[name=inputRequestTypeId]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputServiceDetail]")) && passValidate;
	return passValidate;
}
if(viewName=="admin-service-add"){
	$("#inputEmpHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputEmpHospitalId"),$("#inputSectionId"),null,null,function(){		
			ajaxGetServiceType($("#inputRequestTypeId"),$("#inputSectionId"),$("#inputServiceTypeId"),null,null);
		});
	});
	$("#inputSectionId, #inputRequestTypeId").change(function(){
		ajaxGetServiceType($("#inputRequestTypeId"),$("#inputSectionId"),$("#inputServiceTypeId"),null,null);
	});
}
//end admin-service-add

//admin-service-edit
function validateAdminServiceEditForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeSelect($("select[id=inputServiceTypeId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[id=inputSectionId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[name=inputEmpHospitalId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[name=inputRequestTypeId]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputServiceDetail]")) && passValidate;

	return passValidate;
}
if(viewName=="admin-service-edit"){
	$("#inputEmpHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputEmpHospitalId"),$("#inputSectionId"),null,null,function(){		
			ajaxGetServiceType($("#inputRequestTypeId"),$("#inputSectionId"),$("#inputServiceTypeId"),null,null);
		});
	});
	$("#inputSectionId, #inputRequestTypeId").change(function(){
		ajaxGetServiceType($("#inputRequestTypeId"),$("#inputSectionId"),$("#inputServiceTypeId"),null,null);
	});

	ajaxGetSectionFromHospital($("#inputEmpHospitalId"),$("#inputSectionId"),$("input[name=inputOldSectionId]").val(),null,function(){		
		ajaxGetServiceType($("#inputRequestTypeId"),$("#inputSectionId"),$("#inputServiceTypeId"),$("input[name=inputOldServiceTypeId]").val(),null);
	});
}
//end admin-service-edit

//admin-service
function enableService(service_id,dataTable){
	showPageLoading();
	$.post(serviceAdminEnableUrl, {"service_id":service_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","บริการที่เลือกถูกเปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function disableService(service_id,dataTable){
	showPageLoading();
	$.post(serviceAdminDisableUrl, {"service_id":service_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","บริการที่เลือกถูกปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function deleteService(service_id,service_detail,dataTable){
	openModal("ยืนยันการลบ","ยืนยันการลบบริการ "+service_detail+"?",true,function(){
		showPageLoading();
		$.post(serviceAdminDeleteUrl, {"service_id":service_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","บริการถูกลบเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
if(viewName=="admin-service-index"){
	$("#inputEmpHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputEmpHospitalId"),$("#inputSectionId"),null,null,function(){		
			ajaxGetServiceType($("#inputRequestTypeId"),$("#inputSectionId"),$("#inputServiceTypeId"),null,null);
		});
	});
	$("#inputSectionId, #inputRequestTypeId").change(function(){
		ajaxGetServiceType($("#inputRequestTypeId"),$("#inputSectionId"),$("#inputServiceTypeId"),null,null);
	});

	$("#inputEmpHospitalId").val(userHosId);
	ajaxGetSectionFromHospital($("#inputEmpHospitalId"),$("#inputSectionId"),userSectionId,'T',function(){ functionInitTable(); });

	$("#inputEmpHospitalId").closest("form").on('reset',function() {
		setTimeout(function(){
			ajaxGetSectionFromHospital($("#inputEmpHospitalId"),$("#inputSectionId"),null,null,function(){		
				ajaxGetServiceType($("#inputRequestTypeId"),$("#inputSectionId"),$("#inputServiceTypeId"),null,null);
			});
	  },100);
	});

	var functionInitTable=function(){
		bpkDataTable=$('#admin-service-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.service_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.servicetype_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.request_type_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.hos_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.section_detail;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.isused=='T'){
							return '<span class="label label-success">ใช้งาน</span>';
						}
						else{
							return '<span class="label label-important">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+serviceAdminEditUrl+'/'+full.service_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="icon-wrench icon-white"></i></a>';
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="deleteService(\''+full.service_id+'\',\''+full.service_detail+'\',$(\'#admin-service-datatable\')); return false;" class="btn btn-danger" rel="tooltip" data-title="ลบ"><i class="icon-trash icon-white"></i></a>';
					}
				},
	            {
	            	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						var returnHtml= '<div class="btn-group">'
			            		+'<a class="btn-more btn btn-info dropdown-toggle" data-toggle="dropdown" href="#">'
			            		+'	More'
			            		+'	<span class="caret"></span>'
			            		+'</a>'
			            		+'<ul class="dropdown-menu">'
			            		+'	<li>';
			            if(full.isused=="T"){
			            	returnHtml+='<a href="#" onclick="disableService(\''+full.service_id+'\',$(\'#admin-service-datatable\')); return false;"><span>ไม่ใช้งาน</span></a>';
			            }
			            else{
			            	returnHtml+='<a href="#" onclick="enableService(\''+full.service_id+'\',$(\'#admin-service-datatable\')); return false;"><span>ใช้งาน</span></a>';
			            }
			            returnHtml+='</li>'
			            		+'</ul>'
			            	+'</div>';
			            return returnHtml;
					}
	            }
	        ],
	        "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
				aoData.push( { "name": "service_detail", "value": $("#inputServiceDetail").val() } );
				aoData.push( { "name": "servicetype_id", "value": $("#inputServiceTypeId").val() } );
				aoData.push( { "name": "request_type_id", "value": $("#inputRequestTypeId").val() } );
				aoData.push( { "name": "hos_id", "value": $("#inputEmpHospitalId").val() } );
				aoData.push( { "name": "section_id", "value": $("#inputSectionId").val() } );
				aoData.push( { "name": "isused", "value": $("#inputServiceStatus").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-service-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	};
}
//end admin-service



//admin-section-add
function validateAdminSectionAddForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputSectionDetail]")) && passValidate;

	if(passValidate){
		$.ajax({
		  type: 'POST',
		  url: ajaxIsSectionDetailExistUrl,
		  data: {"sectionDetail":$("input[name=inputSectionDetail]").val()},
		  success: function(data) {
				if(data.exist){
					updateInputErrMsg("ชื่อแผนก "+$("input[name=inputSectionDetail]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputSectionDetail]"));
					passValidate=false;
				}
			},
		  dataType: "json",
		  async:false
		});
	}
	return passValidate;
}
if(viewName=="admin-section-add"){
	$("#inputEmpHospitalId").change(function(){
		ajaxGetDivisionFromHospital($("#inputEmpHospitalId"),$("#inputDivisionId"),null,null);
	});
}
//end admin-section-add

//admin-section-edit
function validateAdminSectionEditForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputSectionDetail]")) && passValidate;
	
	if(passValidate){
		if($("input[name=inputSectionDetail]").val()!=$("input[name=inputOldSectionDetail]").val()){
			$.ajax({
			  type: 'POST',
			  url: ajaxIsSectionDetailExistUrl,
			  data: {"sectionDetail":$("input[name=inputSectionDetail]").val()},
			  success: function(data) {
					if(data.exist){
						updateInputErrMsg("ชื่อแผนก "+$("input[name=inputSectionDetail]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputSectionDetail]"));
						passValidate=false;
					}
				},
			  dataType: "json",
			  async:false
			});
		}
	}

	return passValidate;
}
if(viewName=="admin-section-edit"){
	$("#inputEmpHospitalId").change(function(){
		ajaxGetDivisionFromHospital($("#inputEmpHospitalId"),$("#inputDivisionId"),null,null);
	});
	ajaxGetDivisionFromHospital($("#inputEmpHospitalId"),$("#inputDivisionId"),$("input[name=inputOldDivisionId]").val(),null);
}
//end admin-section-edit
//admin-section
function enableSection(section_id,dataTable){
	showPageLoading();
	$.post(sectionAdminEnableUrl, {"section_id":section_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","แผนกที่เลือกถูกเปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function disableSection(section_id,dataTable){
	showPageLoading();
	$.post(sectionAdminDisableUrl, {"section_id":section_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","แผนกที่เลือกถูกปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function deleteSection(section_id,section_detail,dataTable){
	openModal("ยืนยันการลบ","ยืนยันการลบแผนก "+section_detail+"?",true,function(){
		showPageLoading();
		$.post(sectionAdminDeleteUrl, {"section_id":section_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","แผนกถูกลบเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
//admin-section
if(viewName=="admin-section-index"){
	$(document).ready(function() {
		bpkDataTable=$('#admin-section-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.section_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.hos_detail;
					} 
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.isused=='T'){
							return '<span class="label label-success">ใช้งาน</span>';
						}
						else{
							return '<span class="label label-important">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+sectionViewUrl+'/'+full.section_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="icon-search icon-white"></i></a>';
					}
				},	         
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+sectionAdminEditUrl+'/'+full.section_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="icon-wrench icon-white"></i></a>';
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="deleteSection(\''+full.section_id+'\',\''+full.section_detail+'\',$(\'#admin-section-datatable\')); return false;" class="btn btn-danger" rel="tooltip" data-title="ลบ"><i class="icon-trash icon-white"></i></a>';
					}
				},
	            {
	            	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						var returnHtml= '<div class="btn-group">'
			            		+'<a class="btn-more btn btn-info dropdown-toggle" data-toggle="dropdown" href="#">'
			            		+'	More'
			            		+'	<span class="caret"></span>'
			            		+'</a>'
			            		+'<ul class="dropdown-menu">'
			            		+'	<li>';
			            if(full.isused=="T"){
			            	returnHtml+='<a href="#" onclick="disableSection(\''+full.section_id+'\',$(\'#admin-section-datatable\')); return false;"><span>ไม่ใช้งาน</span></a>';
			            }
			            else{
			            	returnHtml+='<a href="#" onclick="enableSection(\''+full.section_id+'\',$(\'#admin-section-datatable\')); return false;"><span>ใช้งาน</span></a>';
			            }
			            returnHtml+='</li>'
			            		+'</ul>'
			            	+'</div>';
			            return returnHtml;
					}
	      }
	        ],
	        "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
				aoData.push( { "name": "detail", "value": $("#inputSectionDetail").val() } );
			  aoData.push( { "name": "hos_id", "value": $("#inputEmpHospital").val() } );
				aoData.push( { "name": "isused", "value": $("#inputSectionStatus").val() } );
				aoData.push( { "name": "hr_section_code", "value": $("#inputHRSectionCode").val() } );				
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-section-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	});
}
//end admin-section



//admin-template-add
function validateAdminTemplateAddForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeSelect($("select[name=inputServiceId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[name=inputServiceTypeId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[name=inputSectionId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[name=inputHospitalId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[name=inputRequestTypeId]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputTemplateTitle]")) && passValidate;

	return passValidate;
}
if(viewName=="admin-template-add"){
	$("#inputHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,null,function(){		
			ajaxGetServiceType($("#inputRequestTypeId"),$("#inputSectionId"),$("#inputServiceTypeId"),null,null,function(){
				ajaxGetService($("#inputServiceTypeId"),$("#inputServiceId"),null,null);
			});
		});
	});
	$("#inputSectionId, #inputRequestTypeId").change(function(){		
		ajaxGetServiceType($("#inputRequestTypeId"),$("#inputSectionId"),$("#inputServiceTypeId"),null,null,function(){
			ajaxGetService($("#inputServiceTypeId"),$("#inputServiceId"),null,null);
		});
	});
	$("#inputServiceTypeId").change(function(){		
		ajaxGetService($("#inputServiceTypeId"),$("#inputServiceId"),null,null);
	});
}
//end admin-template-add

//admin-template-edit
function validateAdminTemplateEditForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeSelect($("select[name=inputServiceId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[name=inputServiceTypeId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[name=inputSectionId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[name=inputHospitalId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[name=inputRequestTypeId]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputTemplateTitle]")) && passValidate;

	return passValidate;
}
if(viewName=="admin-template-edit"){

	$("#inputHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,null,function(){		
			ajaxGetServiceType($("#inputRequestTypeId"),$("#inputSectionId"),$("#inputServiceTypeId"),null,null,function(){
				ajaxGetService($("#inputServiceTypeId"),$("#inputServiceId"),null,null);
			});
		});
	});
	$("#inputSectionId, #inputRequestTypeId").change(function(){		
		ajaxGetServiceType($("#inputRequestTypeId"),$("#inputSectionId"),$("#inputServiceTypeId"),null,null,function(){
			ajaxGetService($("#inputServiceTypeId"),$("#inputServiceId"),null,null);
		});
	});
	$("#inputServiceTypeId").change(function(){		
		ajaxGetService($("#inputServiceTypeId"),$("#inputServiceId"),null,null);
	});

	ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),$("input[name=inputOldSectionId]").val(),null,function(){		
		ajaxGetServiceType($("#inputRequestTypeId"),$("#inputSectionId"),$("#inputServiceTypeId"),$("input[name=inputOldServiceTypeId]").val(),null,function(){
			ajaxGetService($("#inputServiceTypeId"),$("#inputServiceId"),$("input[name=inputOldServiceId]").val(),null);
		});
	});


	$(document).ready(function() {
		//Table Template Task
		var bpkDataTableTemplateTask=$('#template-task-datatable').dataTable({
			"bFilter": false,
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.computed_order;
					}
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.task_title;
					}
				},
	      { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						if(full.parent_task_id==null) return "";
						return '<a target="_blank" href="'+templateTaskViewUrl+'/'+full.parent_task_id+'" rel="tooltip" data-title="View">'+full.parent_template_task_title+'</a>';
					}
				},
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.create_date;
					}
				},
	      { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+templateTaskViewUrl+'/'+full.task_id+'" class="btn btn-primary margin-right3" rel="tooltip" data-title="View"><i class="icon-search icon-white"></i></a>'
						+'<button onclick="upTemplateTaskOrder(\''+full.task_id+'\',$(\'#template-task-datatable\'));" class="btn '+(full.task_order=="1"?'':'btn-success')+' margin-right3 '+(full.task_order=="1"?'disabled':'')+'" rel="tooltip" data-title="Up"><i class="icon-arrow-up icon-white"></i></button>'
						+'<button onclick="downTemplateTaskOrder(\''+full.task_id+'\',$(\'#template-task-datatable\'));" class="btn '+(full.is_max_task_order=="1"?'':'btn-danger')+' margin-right3 '+(full.is_max_task_order=="1"?'disabled':'')+'" rel="tooltip" data-title="Down"><i class="icon-arrow-down icon-white"></i></button>';
					}
				},
				{
	        "mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						var returnHtml= '<div class="btn-group">'
			            		+'<a class="btn-more btn btn-info dropdown-toggle" data-toggle="dropdown" href="#">'
			            		+'	More'
			            		+'	<span class="caret"></span>'
			            		+'</a>'
			            		+'<ul class="dropdown-menu">';
			            returnHtml+='<li><a target="_blank" href="'+templateTaskAdminEditUrl+'/'+full.task_id+'"><span>แก้ไข</span></a></li>';			            
			            returnHtml+='<li><a href="#" onclick="deleteTemplateTask(\''+full.task_id+'\',\''+full.task_title+'\',$(\'#template-task-datatable\')); return false;"><span>ลบ</span></a></li>';
			            		+'</ul>'
			            	+'</div>';
			            return returnHtml;
					}
		    }
	    ],
	    "aaSorting": [[ 0, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl_TemplateTask,
			"sServerMethod": "POST",
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings,false);
			}
		});
	});
}
//end admin-template-edit

//admin-template
function enableTemplate(template_project_id,dataTable){
	showPageLoading();
	$.post(templateAdminEnableUrl, {"template_project_id":template_project_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","Template ที่เลือกถูกเปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function disableTemplate(template_project_id,dataTable){
	showPageLoading();
	$.post(templateAdminDisableUrl, {"template_project_id":template_project_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","Template ที่เลือกถูกปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function deleteTemplate(template_project_id,template_detail,dataTable){
	openModal("ยืนยันการลบ","ยืนยันการลบ Template "+template_detail+"?",true,function(){
		showPageLoading();
		$.post(templateAdminDeleteUrl, {"template_project_id":template_project_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","Template ถูกลบเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
if(viewName=="admin-template-index"){
	$("#inputHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,null,function(){		
			ajaxGetServiceType($("#inputRequestTypeId"),$("#inputSectionId"),$("#inputServiceTypeId"),null,null,function(){
				ajaxGetService($("#inputServiceTypeId"),$("#inputServiceId"),null,null);
			});
		});
	});
	$("#inputSectionId, #inputRequestTypeId").change(function(){		
		ajaxGetServiceType($("#inputRequestTypeId"),$("#inputSectionId"),$("#inputServiceTypeId"),null,null,function(){
			ajaxGetService($("#inputServiceTypeId"),$("#inputServiceId"),null,null);
		});
	});
	$("#inputServiceTypeId").change(function(){		
		ajaxGetService($("#inputServiceTypeId"),$("#inputServiceId"),null,null);
	});

	$("#inputHospitalId").val(userHosId);
	ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),userSectionId,'T',function(){ functionInitTable(); });

	$("#inputHospitalId").closest("form").on('reset',function() {
		setTimeout(function(){
			ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,null,function(){		
				ajaxGetServiceType($("#inputRequestTypeId"),$("#inputSectionId"),$("#inputServiceTypeId"),null,null,function(){
					ajaxGetService($("#inputServiceTypeId"),$("#inputServiceId"),null,null);
				});
			});
	  },100);
	});

	var functionInitTable=function(){
		bpkDataTable=$('#admin-template-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.title;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.service_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.servicetype_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.request_type_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.hos_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.section_detail;
					}
				},
	            { 	"mData" : null, "sClass": "right",
					"mRender": function ( data, type, full ) {
						return full.count_task;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.isused=='T'){
							return '<span class="label label-success">ใช้งาน</span>';
						}
						else{
							return '<span class="label label-important">ไม่ใช้งาน</span>';
						}
					}
				},
				{ 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+templateViewUrl+'/'+full.template_project_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="icon-search icon-white"></i></a>';
					}
				},	 
	            {
	            	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						var returnHtml= '<div class="btn-group">'
			            		+'<a class="btn-more btn btn-info dropdown-toggle" data-toggle="dropdown" href="#">'
			            		+'	More'
			            		+'	<span class="caret"></span>'
			            		+'</a>'
			            		+'<ul class="dropdown-menu">'
			            		+'	<li>';
			            if(full.isused=="T"){
			            	returnHtml+='<a href="#" onclick="disableTemplate(\''+full.template_project_id+'\',$(\'#admin-template-datatable\')); return false;"><span>ไม่ใช้งาน</span></a>';
			            }
			            else{
			            	returnHtml+='<a href="#" onclick="enableTemplate(\''+full.template_project_id+'\',$(\'#admin-template-datatable\')); return false;"><span>ใช้งาน</span></a>';
			            }
			            returnHtml+='</li>'
			            returnHtml+='<li><a target="_blank" href="'+templateAdminEditUrl+'/'+full.template_project_id+'"><span>แก้ไข</span></a></li>';			            
			            returnHtml+='<li><a href="#" onclick="deleteTemplate(\''+full.template_project_id+'\',\''+full.title+'\',$(\'#admin-template-datatable\')); return false;"><span>ลบ</span></a></li>';
			            		+'</ul>'
			            	+'</div>';
			            return returnHtml;
					}
	            }
	        ],
	        "aaSorting": [[ 0, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
				aoData.push( { "name": "template_title", "value": $("#inputTemplateTitle").val() } );
				aoData.push( { "name": "service_id", "value": $("#inputServiceId").val() } );
				aoData.push( { "name": "servicetype_id", "value": $("#inputServiceTypeId").val() } );
				aoData.push( { "name": "request_type_id", "value": $("#inputRequestTypeId").val() } );
				aoData.push( { "name": "hos_id", "value": $("#inputEmpHospital").val() } );
				aoData.push( { "name": "section_id", "value": $("#inputSectionId").val() } );
				aoData.push( { "name": "isused", "value": $("#inputTemplateStatus").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-template-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	};
}
//end admin-template

//admin-templatetask
//admin-templatetask-add
function validateAdminTemplateTaskAddForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputTemplateTaskTitle]")) && passValidate;

	return passValidate;
}
if(viewName=="admin-templatetask-add"){
}
//end admin-templatetask-add

//admin-template-edit
function validateAdminTemplateTaskEditForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputTemplateTaskTitle]")) && passValidate;

	return passValidate;
}
if(viewName=="admin-templatetask-edit"){
}
//end admin-templatetask-edit
function deleteTemplateTask(template_task_id,template_detail,dataTable){
	openModal("ยืนยันการลบ","ยืนยันการลบงาน "+template_detail+"?",true,function(){
		showPageLoading();
		$.post(templateTaskAdminDeleteUrl, {"template_task_id":template_task_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","งานถูกลบเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
function upTemplateTaskOrder(task_id,dataTable){
	showPageLoading();
	$.post(templateTaskAdminUpTaskOrderUrl, {"template_task_id":task_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","บันทึกการเปลี่ยนแปลงลำดับงานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function downTemplateTaskOrder(task_id,dataTable){
	showPageLoading();
	$.post(templateTaskAdminDownTaskOrderUrl, {"template_task_id":task_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","บันทึกการเปลี่ยนแปลงลำดับงานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
//end admin-templatetask


//admin-workstation-add
function validateAdminWorkStationAddForm(){
	var passValidate=true;
	var wsId=$.trim($("input[name=inputWsId]").val());
	$("input[name=inputWsId]").val(wsId);
	//check input bottom up
	passValidate=checkInputTypeSelect($("select[id=inputSectionId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[id=inputEmpHospitalId]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputWsDetail]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputWsId]")) && passValidate;

	if(passValidate){
		$.ajax({
		  type: 'POST',
		  url: ajaxIsWsIdExistUrl,
		  data: {"wsId":$("input[name=inputWsId]").val()},
		  success: function(data) {
				if(data.exist){
					updateInputErrMsg("รหัส "+$("input[name=inputWsId]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputWsId]"));
					passValidate=false;
				}
			},
		  dataType: "json",
		  async:false
		});
	}
	return passValidate;
}
if(viewName=="admin-workstation-add"){
	$("#inputEmpHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputEmpHospitalId"),$("#inputSectionId"),null,null);
	});
}
//end admin-workstation-add

//admin-workstation-edit
function validateAdminWorkStationEditForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeSelect($("select[id=inputSectionId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[id=inputEmpHospitalId]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputWsDetail]")) && passValidate;
	// passValidate=checkInputTypeText($("input[name=inputWsId]")) && passValidate;
	
	// if(passValidate){
	// 	if($("input[name=inputWsId]").val()!=$("input[name=inputOldWsId]").val()){
	// 		$.ajax({
	// 		  type: 'POST',
	// 		  url: ajaxIsWsIdExistUrl,
	// 		  data: {"wsId":$("input[name=inputWsId]").val()},
	// 		  success: function(data) {
	// 				if(data.exist){
	// 					updateInputErrMsg("รหัส "+$("input[name=inputWsId]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputWsId]"));
	// 					passValidate=false;
	// 				}
	// 			},
	// 		  dataType: "json",
	// 		  async:false
	// 		});
	// 	}
	// }

	return passValidate;
}
if(viewName=="admin-workstation-edit"){
	$("#inputEmpHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputEmpHospitalId"),$("#inputSectionId"),null,null);
	});
	ajaxGetSectionFromHospital($("#inputEmpHospitalId"),$("#inputSectionId"),$("input[name=inputOldSectionId]").val(),null);
}
//end admin-workstation-edit
//admin-workstation
function enableWorkStation(workstation_id,dataTable){
	showPageLoading();
	$.post(workstationAdminEnableUrl, {"ws_id":workstation_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","Work Station ที่เลือกถูกเปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function disableWorkStation(workstation_id,dataTable){
	showPageLoading();
	$.post(workstationAdminDisableUrl, {"ws_id":workstation_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","Work Station ที่เลือกถูกปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function deleteWorkStation(workstation_id,workstation_detail,dataTable){
	openModal("ยืนยันการลบ","ยืนยันการลบ Work Station "+workstation_detail+"?",true,function(){
		showPageLoading();
		$.post(workstationAdminDeleteUrl, {"ws_id":workstation_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","Work Station ถูกลบเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
//admin-workstation
if(viewName=="admin-workstation-index"){
	$("#inputEmpHospital").change(function(){
		ajaxGetSectionFromHospital($("#inputEmpHospital"),$("#inputSectionId"),null,null);
	});

	$("#inputEmpHospital").val(userHosId);
	ajaxGetSectionFromHospital($("#inputEmpHospital"),$("#inputSectionId"),userSectionId,'T',function(){ functionInitTable(); });

	$("#inputEmpHospital").closest("form").on('reset',function() {
		setTimeout(function(){
			ajaxGetSectionFromHospital($("#inputEmpHospital"),$("#inputSectionId"),null,null);
	  },100);
	});

	var functionInitTable=function(){
		bpkDataTable=$('#admin-workstation-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.ws_id;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.ws_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.hos_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.section_detail;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.isused=='T'){
							return '<span class="label label-success">ใช้งาน</span>';
						}
						else{
							return '<span class="label label-important">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+workstationViewUrl+'/'+full.ws_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="icon-search icon-white"></i></a>';
					}
				},	         
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+workstationAdminEditUrl+'/'+full.ws_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="icon-wrench icon-white"></i></a>';
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="deleteWorkStation(\''+full.ws_id+'\',\''+full.ws_detail+'\',$(\'#admin-workstation-datatable\')); return false;" class="btn btn-danger" rel="tooltip" data-title="ลบ"><i class="icon-trash icon-white"></i></a>';
					}
				},
	            {
	            	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						var returnHtml= '<div class="btn-group">'
			            		+'<a class="btn-more btn btn-info dropdown-toggle" data-toggle="dropdown" href="#">'
			            		+'	More'
			            		+'	<span class="caret"></span>'
			            		+'</a>'
			            		+'<ul class="dropdown-menu">'
			            		+'	<li>';
			            if(full.isused=="T"){
			            	returnHtml+='<a href="#" onclick="disableWorkStation(\''+full.ws_id+'\',$(\'#admin-workstation-datatable\')); return false;"><span>ไม่ใช้งาน</span></a>';
			            }
			            else{
			            	returnHtml+='<a href="#" onclick="enableWorkStation(\''+full.ws_id+'\',$(\'#admin-workstation-datatable\')); return false;"><span>ใช้งาน</span></a>';
			            }
			            returnHtml+='</li>'
			            		+'</ul>'
			            	+'</div>';
			            return returnHtml;
					}
	      }
	        ],
	        "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
				aoData.push( { "name": "ws_id", "value": $("#inputWsId").val() } );
				aoData.push( { "name": "ws_detail", "value": $("#inputWsDetail").val() } );
	      aoData.push( { "name": "hos_id", "value": $("#inputEmpHospital").val() } );
	      aoData.push( { "name": "section_id", "value": $("#inputSectionId").val() } );
				aoData.push( { "name": "isused", "value": $("#inputWsStatus").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-workstation-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	};
}
//end admin-workstation


//admin-service_point-add
function validateAdminServicePointAddForm(){
	var passValidate=true;
	var servicePointId=$.trim($("input[name=inputServicePointId]").val());
	$("input[name=inputServicePointId]").val(servicePointId);
	//check input bottom up
	passValidate=checkInputTypeSelect($("select[id=inputSectionId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[id=inputEmpHospitalId]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputDetail]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputServicePointId]")) && passValidate;

	if(passValidate){
		$.ajax({
		  type: 'POST',
		  url: ajaxIsServicePointIdExistUrl,
		  data: {"servicePointId":$("input[name=inputServicePointId]").val()},
		  success: function(data) {
				if(data.exist){
					updateInputErrMsg("รหัส "+$("input[name=inputServicePointId]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputServicePointId]"));
					passValidate=false;
				}
			},
		  dataType: "json",
		  async:false
		});
	}
	return passValidate;
}
if(viewName=="admin-service_point-add"){
	$("#inputEmpHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputEmpHospitalId"),$("#inputSectionId"),null,null);
	});
}
//end admin-service_point-add

//admin-service_point-edit
function validateAdminServicePointEditForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeSelect($("select[id=inputSectionId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[id=inputEmpHospitalId]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputDetail]")) && passValidate;
	// passValidate=checkInputTypeText($("input[name=inputServicePointId]")) && passValidate;
	
	// if(passValidate){
	// 	if($("input[name=inputServicePointId]").val()!=$("input[name=inputOldServicePointId]").val()){
	// 		$.ajax({
	// 		  type: 'POST',
	// 		  url: ajaxIsServicePointIdExistUrl,
	// 		  data: {"servicePointId":$("input[name=inputServicePointId]").val()},
	// 		  success: function(data) {
	// 				if(data.exist){
	// 					updateInputErrMsg("รหัส "+$("input[name=inputServicePointId]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputServicePointId]"));
	// 					passValidate=false;
	// 				}
	// 			},
	// 		  dataType: "json",
	// 		  async:false
	// 		});
	// 	}
	// }

	return passValidate;
}
if(viewName=="admin-service_point-edit"){
	$("#inputEmpHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputEmpHospitalId"),$("#inputSectionId"),null,null);
	});
	ajaxGetSectionFromHospital($("#inputEmpHospitalId"),$("#inputSectionId"),$("input[name=inputOldSectionId]").val(),null);
}
//end admin-service_point-edit
//admin-service_point
function enableServicePoint(service_point_id,dataTable){
	showPageLoading();
	$.post(servicePointAdminEnableUrl, {"service_point_id":service_point_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","Service Point ที่เลือกถูกเปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function disableServicePoint(service_point_id,dataTable){
	showPageLoading();
	$.post(servicePointAdminDisableUrl, {"service_point_id":service_point_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","Service Point ที่เลือกถูกปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function deleteServicePoint(service_point_id,service_point_detail,dataTable){
	openModal("ยืนยันการลบ","ยืนยันการลบ Service Point "+service_point_detail+"?",true,function(){
		showPageLoading();
		$.post(servicePointAdminDeleteUrl, {"service_point_id":service_point_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","Service Point ถูกลบเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
//admin-service_point
if(viewName=="admin-service_point-index"){
	$("#inputEmpHospital").change(function(){
		ajaxGetSectionFromHospital($("#inputEmpHospital"),$("#inputSectionId"),null,null);
	});

	$("#inputEmpHospital").val(userHosId);
	ajaxGetSectionFromHospital($("#inputEmpHospital"),$("#inputSectionId"),userSectionId,'T',function(){ functionInitTable(); });

	$("#inputEmpHospital").closest("form").on('reset',function() {
		setTimeout(function(){
			ajaxGetSectionFromHospital($("#inputEmpHospital"),$("#inputSectionId"),null,null);
	  },100);
	});

	var functionInitTable=function(){
		bpkDataTable=$('#admin-service_point-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.service_point_id;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.hos_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.section_detail;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.isused=='T'){
							return '<span class="label label-success">ใช้งาน</span>';
						}
						else{
							return '<span class="label label-important">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+servicePointAdminEditUrl+'/'+full.service_point_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="icon-wrench icon-white"></i></a>';
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="deleteServicePoint(\''+full.service_point_id+'\',\''+full.detail+'\',$(\'#admin-service_point-datatable\')); return false;" class="btn btn-danger" rel="tooltip" data-title="ลบ"><i class="icon-trash icon-white"></i></a>';
					}
				},
	            {
	            	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						var returnHtml= '<div class="btn-group">'
			            		+'<a class="btn-more btn btn-info dropdown-toggle" data-toggle="dropdown" href="#">'
			            		+'	More'
			            		+'	<span class="caret"></span>'
			            		+'</a>'
			            		+'<ul class="dropdown-menu">'
			            		+'	<li>';
			            if(full.isused=="T"){
			            	returnHtml+='<a href="#" onclick="disableServicePoint(\''+full.service_point_id+'\',$(\'#admin-service_point-datatable\')); return false;"><span>ไม่ใช้งาน</span></a>';
			            }
			            else{
			            	returnHtml+='<a href="#" onclick="enableServicePoint(\''+full.service_point_id+'\',$(\'#admin-service_point-datatable\')); return false;"><span>ใช้งาน</span></a>';
			            }
			            returnHtml+='</li>'
			            		+'</ul>'
			            	+'</div>';
			            return returnHtml;
					}
	      }
	        ],
	        "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
				aoData.push( { "name": "service_point_id", "value": $("#inputServicePointId").val() } );
				aoData.push( { "name": "detail", "value": $("#inputDetail").val() } );
	      aoData.push( { "name": "hos_id", "value": $("#inputEmpHospital").val() } );
	      aoData.push( { "name": "section_id", "value": $("#inputSectionId").val() } );
				aoData.push( { "name": "isused", "value": $("#inputStatus").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-service_point-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	};
}
//end admin-service_point


//admin-itemtype-add
function validateAdminItemTypeAddForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputItemTypeDetail]")) && passValidate;

	return passValidate;
}
if(viewName=="admin-itemtype-add"){
}
//end admin-itemtype-add

//admin-itemtype-edit
function validateAdminItemTypeEditForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputItemTypeDetail]")) && passValidate;

	return passValidate;
}
if(viewName=="admin-itemtype-edit"){
}
//end admin-itemtype-edit

//admin-itemtype
function enableItemType(itemtype_id,dataTable){
	showPageLoading();
	$.post(itemtypeAdminEnableUrl, {"itemtype_id":itemtype_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ประเภทอุปกรณ์ที่เลือกถูกเปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function disableItemType(itemtype_id,dataTable){
	showPageLoading();
	$.post(itemtypeAdminDisableUrl, {"itemtype_id":itemtype_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ประเภทอุปกรณ์ที่เลือกถูกปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function deleteItemType(itemtype_id,itemtype_detail,dataTable){
	openModal("ยืนยันการลบ","ยืนยันการลบประเภทอุปกรณ์ "+itemtype_detail+"?",true,function(){
		showPageLoading();
		$.post(itemtypeAdminDeleteUrl, {"itemtype_id":itemtype_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","ประเภทอุปกรณ์ถูกลบเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
//admin-itemtype
if(viewName=="admin-itemtype-index"){
	$(document).ready(function() {
		bpkDataTable=$('#admin-itemtype-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.itemtype_detail;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.isused=='T'){
							return '<span class="label label-success">ใช้งาน</span>';
						}
						else{
							return '<span class="label label-important">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+itemtypeAdminEditUrl+'/'+full.itemtype_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="icon-wrench icon-white"></i></a>';
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="deleteItemType(\''+full.itemtype_id+'\',\''+full.itemtype_detail+'\',$(\'#admin-itemtype-datatable\')); return false;" class="btn btn-danger" rel="tooltip" data-title="ลบ"><i class="icon-trash icon-white"></i></a>';
					}
				},
	            {
	            	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						var returnHtml= '<div class="btn-group">'
			            		+'<a class="btn-more btn btn-info dropdown-toggle" data-toggle="dropdown" href="#">'
			            		+'	More'
			            		+'	<span class="caret"></span>'
			            		+'</a>'
			            		+'<ul class="dropdown-menu">'
			            		+'	<li>';
			            if(full.isused=="T"){
			            	returnHtml+='<a href="#" onclick="disableItemType(\''+full.itemtype_id+'\',$(\'#admin-itemtype-datatable\')); return false;"><span>ไม่ใช้งาน</span></a>';
			            }
			            else{
			            	returnHtml+='<a href="#" onclick="enableItemType(\''+full.itemtype_id+'\',$(\'#admin-itemtype-datatable\')); return false;"><span>ใช้งาน</span></a>';
			            }
			            returnHtml+='</li>'
			            		+'</ul>'
			            	+'</div>';
			            return returnHtml;
					}
	            }
	        ],
	        "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
				aoData.push( { "name": "detail", "value": $("#inputItemTypeDetail").val() } );
				aoData.push( { "name": "isused", "value": $("#inputItemTypeStatus").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-itemtype-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	});
}
//end admin-itemtype



//admin-problemtype-add
function validateAdminProblemTypeAddForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeSelect($("select[id=inputSectionId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[id=inputHospitalId]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputProblemTypeDetail]")) && passValidate;

	return passValidate;
}
if(viewName=="admin-problemtype-add"){
	$("#inputHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,null);
	});
}
//end admin-problemtype-add

//admin-problemtype-edit
function validateAdminProblemTypeEditForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeSelect($("select[id=inputSectionId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[id=inputHospitalId]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputProblemTypeDetail]")) && passValidate;

	return passValidate;
}
if(viewName=="admin-problemtype-edit"){
	$("#inputHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,null);
	});
	ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),$("input[name=inputOldSectionId]").val(),null);
}
//end admin-problemtype-edit

//admin-problemtype
function enableProblemType(problemtype_id,dataTable){
	showPageLoading();
	$.post(problemtypeAdminEnableUrl, {"problemtype_id":problemtype_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ประเภทรายละเอียดการดำเนินงานที่เลือกถูกเปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function disableProblemType(problemtype_id,dataTable){
	showPageLoading();
	$.post(problemtypeAdminDisableUrl, {"problemtype_id":problemtype_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ประเภทรายละเอียดการดำเนินงานที่เลือกถูกปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function deleteProblemType(problemtype_id,problemtype_detail,dataTable){
	openModal("ยืนยันการลบ","ยืนยันการลบประเภทรายละเอียดการดำเนินงาน "+problemtype_detail+"?",true,function(){
		showPageLoading();
		$.post(problemtypeAdminDeleteUrl, {"problemtype_id":problemtype_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","ประเภทรายละเอียดการดำเนินงานถูกลบเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
//admin-problemtype
if(viewName=="admin-problemtype-index"){
	$("#inputHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,null);
	});

	ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),userSectionId,'T',function(){ functionInitTable(); });

	$("#inputHospitalId").closest("form").on('reset',function() {
		setTimeout(function(){
			ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,null);
	  },100);
	});

	var functionInitTable=function(){
		bpkDataTable=$('#admin-problemtype-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.problemtype_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.hos_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.section_detail;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.isused=='T'){
							return '<span class="label label-success">ใช้งาน</span>';
						}
						else{
							return '<span class="label label-important">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+problemtypeAdminEditUrl+'/'+full.problemtype_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="icon-wrench icon-white"></i></a>';
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="deleteProblemType(\''+full.problemtype_id+'\',\''+full.problemtype_detail+'\',$(\'#admin-problemtype-datatable\')); return false;" class="btn btn-danger" rel="tooltip" data-title="ลบ"><i class="icon-trash icon-white"></i></a>';
					}
				},
	            {
	            	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						var returnHtml= '<div class="btn-group">'
			            		+'<a class="btn-more btn btn-info dropdown-toggle" data-toggle="dropdown" href="#">'
			            		+'	More'
			            		+'	<span class="caret"></span>'
			            		+'</a>'
			            		+'<ul class="dropdown-menu">'
			            		+'	<li>';
			            if(full.isused=="T"){
			            	returnHtml+='<a href="#" onclick="disableProblemType(\''+full.problemtype_id+'\',$(\'#admin-problemtype-datatable\')); return false;"><span>ไม่ใช้งาน</span></a>';
			            }
			            else{
			            	returnHtml+='<a href="#" onclick="enableProblemType(\''+full.problemtype_id+'\',$(\'#admin-problemtype-datatable\')); return false;"><span>ใช้งาน</span></a>';
			            }
			            returnHtml+='</li>'
			            		+'</ul>'
			            	+'</div>';
			            return returnHtml;
					}
	            }
	        ],
	        "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
				aoData.push( { "name": "detail", "value": $("#inputProblemTypeDetail").val() } );
				aoData.push( { "name": "hos_id", "value": $("#inputHospitalId").val() } );
				aoData.push( { "name": "section_id", "value": $("#inputSectionId").val() } );
				aoData.push( { "name": "isused", "value": $("#inputProblemTypeStatus").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-problemtype-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	};
}
//end admin-problemtype



//admin-problemtopic-add
function validateAdminProblemTopicAddForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeSelect($("select[id=inputProblemTypeId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[id=inputSectionId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[id=inputHospitalId]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputProblemTopicDetail]")) && passValidate;

	return passValidate;
}
if(viewName=="admin-problemtopic-add"){
	$("#inputHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,null,function(){		
			ajaxGetProblemTypeFromSection($("#inputSectionId"),$("#inputProblemTypeId"),null,null);
		});
	});
	$("#inputSectionId").change(function(){
		ajaxGetProblemTypeFromSection($("#inputSectionId"),$("#inputProblemTypeId"),null,null,null);
	});
}
//end admin-problemtopic-add

//admin-problemtopic-edit
function validateAdminProblemTopicEditForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeSelect($("select[id=inputProblemTypeId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[id=inputSectionId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[id=inputHospitalId]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputProblemTopicDetail]")) && passValidate;

	return passValidate;
}
if(viewName=="admin-problemtopic-edit"){
	$("#inputHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,null,function(){		
			ajaxGetProblemTypeFromSection($("#inputSectionId"),$("#inputProblemTypeId"),null,null);
		});
	});
	$("#inputSectionId").change(function(){
		ajaxGetProblemTypeFromSection($("#inputSectionId"),$("#inputProblemTypeId"),null,null);
	});
	ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),$("input[name=inputOldSectionId]").val(),null,function(){		
		ajaxGetProblemTypeFromSection($("#inputSectionId"),$("#inputProblemTypeId"),$("#inputOldProblemTypeId").val(),null);
	});
}
//end admin-problemtopic-edit

//admin-problemtopic
function enableProblemTopic(problem_topic_id,dataTable){
	showPageLoading();
	$.post(problemtopicAdminEnableUrl, {"problem_topic_id":problem_topic_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","หัวข้อรายละเอียดการดำเนินงานที่เลือกถูกเปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function disableProblemTopic(problem_topic_id,dataTable){
	showPageLoading();
	$.post(problemtopicAdminDisableUrl, {"problem_topic_id":problem_topic_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","หัวข้อรายละเอียดการดำเนินงานที่เลือกถูกปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function deleteProblemTopic(problem_topic_id,problem_topic_detail,dataTable){
	openModal("ยืนยันการลบ","ยืนยันการลบหัวข้อรายละเอียดการดำเนินงาน "+problem_topic_detail+"?",true,function(){
		showPageLoading();
		$.post(problemtopicAdminDeleteUrl, {"problem_topic_id":problem_topic_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","หัวข้อรายละเอียดการดำเนินงานถูกลบเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
//admin-problemtopic
if(viewName=="admin-problemtopic-index"){
	$("#inputHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,null,function(){		
			ajaxGetProblemTypeFromSection($("#inputSectionId"),$("#inputProblemTypeId"),null,null);
		});
	});
	$("#inputSectionId").change(function(){
		ajaxGetProblemTypeFromSection($("#inputSectionId"),$("#inputProblemTypeId"),null,null,null);
	});

	ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),userSectionId,'T',function(){ functionInitTable(); });

	$("#inputHospitalId").closest("form").on('reset',function() {
		setTimeout(function(){
			ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,null,function(){		
				ajaxGetProblemTypeFromSection($("#inputSectionId"),$("#inputProblemTypeId"),null,null);
			});
	  },100);
	});

	var functionInitTable=function(){
		bpkDataTable=$('#admin-problemtopic-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.problem_topic_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.hos_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.section_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.problemtype_detail;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.isused=='T'){
							return '<span class="label label-success">ใช้งาน</span>';
						}
						else{
							return '<span class="label label-important">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+problemtopicAdminEditUrl+'/'+full.problem_topic_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="icon-wrench icon-white"></i></a>';
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="deleteProblemTopic(\''+full.problem_topic_id+'\',\''+full.problem_topic_detail+'\',$(\'#admin-problemtopic-datatable\')); return false;" class="btn btn-danger" rel="tooltip" data-title="ลบ"><i class="icon-trash icon-white"></i></a>';
					}
				},
	            {
	            	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						var returnHtml= '<div class="btn-group">'
			            		+'<a class="btn-more btn btn-info dropdown-toggle" data-toggle="dropdown" href="#">'
			            		+'	More'
			            		+'	<span class="caret"></span>'
			            		+'</a>'
			            		+'<ul class="dropdown-menu">'
			            		+'	<li>';
			            if(full.isused=="T"){
			            	returnHtml+='<a href="#" onclick="disableProblemTopic(\''+full.problem_topic_id+'\',$(\'#admin-problemtopic-datatable\')); return false;"><span>ไม่ใช้งาน</span></a>';
			            }
			            else{
			            	returnHtml+='<a href="#" onclick="enableProblemTopic(\''+full.problem_topic_id+'\',$(\'#admin-problemtopic-datatable\')); return false;"><span>ใช้งาน</span></a>';
			            }
			            returnHtml+='</li>'
			            		+'</ul>'
			            	+'</div>';
			            return returnHtml;
					}
	            }
	        ],
	        "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
				aoData.push( { "name": "detail", "value": $("#inputProblemTopicDetail").val() } );
				aoData.push( { "name": "hos_id", "value": $("#inputHospitalId").val() } );
				aoData.push( { "name": "section_id", "value": $("#inputSectionId").val() } );
				aoData.push( { "name": "problemtype_id", "value": $("#inputProblemTypeId").val() } );
				aoData.push( { "name": "isused", "value": $("#inputProblemTopicStatus").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-problemtopic-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	};
}
//end admin-problemtopic


//admin-wsitem-add
function wsItemAddMoreImage(){	
	var fileUploadDivElem=$("#addEditForm .div-input-image.last");
	var newElem=fileUploadDivElem.clone();
	fileUploadDivElem.removeClass("last");
	fileUploadDivElem.after(newElem);
	newElem.find("input[type=file]").val("");
	newElem.find('span.btn').show();
	newElem.find(".modal-cancel-existing-image").hide();
	newElem.find('.existingImage').hide();
	newElem.find('.defaultImage').show();
	newElem.find("div.fileupload").fileupload('clear');
	newElem.find("input[type=file]").attr("name","inputImage[]");
	newElem.find("input[name^=inputCancelExistingImage]").val('');
	newElem.find("input[name^=inputOldResourceImageId]").val('');
}
function validateAdminWsItemAddForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputSerial]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputBrand]")) && passValidate;
	// passValidate=checkInputTypeSelect($("select[name=inputWsId]")) && passValidate;
	// passValidate=checkInputTypeSelect($("select[name=inputSectionId]")) && passValidate;
	// passValidate=checkInputTypeSelect($("select[name=inputEmpHospitalId]")) && passValidate;
	passValidate=checkInputTypeSelect($("#inputItemTypeId")) && passValidate;
	// passValidate=checkInputTypeText($("input[name=inputWsItemId]")) && passValidate;

	// if(passValidate){
	// 	$.ajax({
	// 	  type: 'POST',
	// 	  url: ajaxIsWsItemIdExistUrl,
	// 	  data: {"wsItemId":$("input[name=inputWsItemId]").val()},
	// 	  success: function(data) {
	// 			if(data.exist){
	// 				updateInputErrMsg("รหัส "+$("input[name=inputWsItemId]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputWsItemId]"));
	// 				passValidate=false;
	// 			}
	// 		},
	// 	  dataType: "json",
	// 	  async:false
	// 	});
	// }
	return passValidate;
}
if(viewName=="admin-wsitem-add"){
	$("#inputHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,null,function(){	
			ajaxGetWorkstationFromSection($("#inputSectionId"),$("#inputWsId"),null,null);
		});
	});
	$("#inputSectionId").change(function(){
		ajaxGetWorkstationFromSection($("#inputSectionId"),$("#inputWsId"),null,null);
	});
}
//end admin-wsitem-add

//admin-wsitem-edit
function validateAdminWsItemEditForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputSerial]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputBrand]")) && passValidate;
	// passValidate=checkInputTypeSelect($("select[name=inputWsId]")) && passValidate;
	// passValidate=checkInputTypeSelect($("select[name=inputSectionId]")) && passValidate;
	// passValidate=checkInputTypeSelect($("select[name=inputEmpHospitalId]")) && passValidate;
	passValidate=checkInputTypeSelect($("#inputItemTypeId")) && passValidate;
	// passValidate=checkInputTypeText($("input[name=inputWsItemId]")) && passValidate;
	
	// if(passValidate){
	// 	if($("input[name=inputWsItemId]").val()!=$("input[name=inputOldWsItemId]").val()){
	// 		$.ajax({
	// 		  type: 'POST',
	// 		  url: ajaxIsWsItemIdExistUrl,
	// 		  data: {"wsItemId":$("input[name=inputWsItemId]").val()},
	// 		  success: function(data) {
	// 				if(data.exist){
	// 					updateInputErrMsg("รหัส "+$("input[name=inputWsItemId]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputWsItemId]"));
	// 					passValidate=false;
	// 				}
	// 			},
	// 		  dataType: "json",
	// 		  async:false
	// 		});
	// 	}
	// }

	return passValidate;
}
if(viewName=="admin-wsitem-edit"){
	$("#inputHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,null,function(){		
			ajaxGetWorkstationFromSection($("#inputSectionId"),$("#inputWsId"),$("#inputOldWsId").val(),null);
		});
	});
	$("#inputSectionId").change(function(){
		ajaxGetWorkstationFromSection($("#inputSectionId"),$("#inputWsId"),null,null);
	});
	ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),$("input[name=inputOldSectionId]").val(),null,function(){		
		ajaxGetWorkstationFromSection($("#inputSectionId"),$("#inputWsId"),$("#inputOldWsId").val(),null);
	});
}
//end admin-wsitem-edit
//admin-wsitem
function enableWsItem(wsitem_id,dataTable){
	showPageLoading();
	$.post(wsitemAdminEnableUrl, {"wsitem_id":wsitem_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","อุปกรณ์ที่เลือกถูกเปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function disableWsItem(wsitem_id,dataTable){
	showPageLoading();
	$.post(wsitemAdminDisableUrl, {"wsitem_id":wsitem_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","อุปกรณ์ที่เลือกถูกปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function deleteWsItem(wsitem_id,wsitem_id,dataTable){
	openModal("ยืนยันการลบ","ยืนยันการลบอุปกรณ์ "+wsitem_id+"?",true,function(){
		showPageLoading();
		$.post(wsitemAdminDeleteUrl, {"wsitem_id":wsitem_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","อุปกรณ์ถูกลบเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
//admin-wsitem
if(viewName=="admin-wsitem-index"){
	$("#inputHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,null);
	});

	ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),userSectionId,'T',function(){ functionInitTable(); });

	$("#inputHospitalId").closest("form").on('reset',function() {
		setTimeout(function(){
			ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,null);
	  },100);
	});

	var functionInitTable=function(){
		bpkDataTable=$('#admin-wsitem-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.wsitem_id;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.ws_id;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.hos_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.section_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.itemtype_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.wsitem_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.brand;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.serial;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.acc_id;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.med_id;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.isused=='T'){
							return '<span class="label label-success">ใช้งาน</span>';
						}
						else if(full.isused=='S'){
							return '<span class="label label-warning">จำหน่าย</span>';
						}
						else{
							return '<span class="label label-important">ไม่ใช้งาน</span>';
						}
					}
				}, { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.can_borrow=='T'){
							return '<span class="label label-success">ยืมได้</span>';
						}
						else{
							return '<span class="label label-important">ยืมไม่ได้</span>';
						}
					}
				},
				{ 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+wsitemViewUrl+'/'+full.wsitem_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="icon-search icon-white"></i></a>';
					}
				},	         
	            {
	            	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						var returnHtml= '<div class="btn-group">'
			            		+'<a class="btn-more btn btn-info dropdown-toggle" data-toggle="dropdown" href="#">'
			            		+'	More'
			            		+'	<span class="caret"></span>'
			            		+'</a>'
			            		+'<ul class="dropdown-menu">'
			            		+'	<li>';
			            if(full.isused=="T"){
			            	returnHtml+='<a href="#" onclick="disableWsItem(\''+full.wsitem_id+'\',$(\'#admin-wsitem-datatable\')); return false;"><span>ไม่ใช้งาน</span></a>';
			            }
			            else{
			            	returnHtml+='<a href="#" onclick="enableWsItem(\''+full.wsitem_id+'\',$(\'#admin-wsitem-datatable\')); return false;"><span>ใช้งาน</span></a>';
			            }
			            returnHtml+='</li>'
			            returnHtml+='<li><a target="_blank" href="'+wsitemAdminEditUrl+'/'+full.wsitem_id+'"><span>แก้ไข</span></a></li>';			            
			            returnHtml+='<li><a href="#" onclick="deleteWsItem(\''+full.wsitem_id+'\',\''+full.wsitem_id+'\',$(\'#admin-wsitem-datatable\')); return false;"><span>ลบ</span></a></li>';			            
			            		+'</ul>'
			            	+'</div>';
			            return returnHtml;
					}
	            }
	        ],
	        "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
				aoData.push( { "name": "wsitem_id", "value": $("#inputItemId").val() } );
				aoData.push( { "name": "ws_id", "value": $("#inputWsId").val() } );
				aoData.push( { "name": "hos_id", "value": $("#inputHospitalId").val() } );
				aoData.push( { "name": "section_id", "value": $("#inputSectionId").val() } );
				aoData.push( { "name": "itemtype_detail", "value": $("#inputItemTypeDetail").val() } );
				aoData.push( { "name": "brand", "value": $("#inputItemBrand").val() } );
				aoData.push( { "name": "model", "value": $("#inputItemModel").val() } );
				aoData.push( { "name": "serial", "value": $("#inputItemSerial").val() } );
				aoData.push( { "name": "acc_id", "value": $("#inputItemAccId").val() } );
				aoData.push( { "name": "med_id", "value": $("#inputItemMedId").val() } );
				aoData.push( { "name": "isused", "value": $("#inputItemStatus").val() } );
				aoData.push( { "name": "can_borrow", "value": $("#inputCanBorrow").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-wsitem-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	};
}
//admin-wsitem-history
if(viewName=="admin-wsitem-history"){
	$(document).ready(function() {
		bpkDataTable=$('#admin-wsitem-history-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+wsitemViewUrl+'/'+full.wsitem_id+'" rel="tooltip" data-title="View">'+full.wsitem_id+'</a>';

					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+workstationViewUrl+'/'+full.ws_id+'" rel="tooltip" data-title="View">'+full.ws_id+'</a>';

					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.itemtype_detail;
					}
				},
				 { 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return '<a target="_blank" href="'+employeeViewUrl+'/'+full.create_by_emp_id+'" rel="tooltip" data-title="View">'+full.create_by_emp_name+'</a>';
				}
			},
				 { 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return '<a target="_blank" href="'+employeeViewUrl+'/'+full.incharge_emp_id+'" rel="tooltip" data-title="View">'+full.incharge_emp_name+'</a>';
				}
			},
      { 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
					if(full.wsitem_action_id=='1'){
						return full.wsitem_action_detail+' จาก '
						+'<a target="_blank" href="'+workstationViewUrl+'/'+full.object_id1+'" rel="tooltip" data-title="View">'+full.object_id1+'</a>'
						+' ไป '
						+'<a target="_blank" href="'+workstationViewUrl+'/'+full.object_id2+'" rel="tooltip" data-title="View">'+full.object_id2+'</a>';
					}
					else{
						return full.wsitem_action_detail;
					}
				} 
			},
      { 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
					return full.create_date;
				}
			}
	        ],
	        "aaSorting": [[ 7, "desc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl_History,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
				aoData.push( { "name": "wsitem_id", "value": $("#inputItemId").val() } );
				aoData.push( { "name": "ws_id", "value": $("#inputWsId").val() } );
				aoData.push( { "name": "itemtype_detail", "value": $("#inputItemTypeDetail").val() } );
				aoData.push( { "name": "incharge_emp_name", "value": $("#inputInchargeEmpName").val() } );
				aoData.push( { "name": "create_by_emp_name", "value": $("#inputCreateByEmpName").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-wsitem-history-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	});
}
//admin-wsitem-report
function validateAdminWsitemReportForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeDateBetween($("#inputDateStart"),$("#inputDateEnd")) && passValidate;
	passValidate=checkInputTypeText($("#inputInchargeEmpId")) && passValidate;
	return passValidate;
}
//end admin-wsitem


//admin-document_type-add
function validateAdminDocumentTypeAddForm(){
	var passValidate=true;

	$("input[name=inputDocumentTypeCode]").val($.trim($("input[name=inputDocumentTypeCode]").val()));
	$("input[name=inputDocumentTypeDetail]").val($.trim($("input[name=inputDocumentTypeDetail]").val()));

	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputDocumentTypeDetail]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputDocumentTypeCode]")) && passValidate;

	if(passValidate){
		$.ajax({
		  type: 'POST',
		  url: ajaxIsDocumentTypeCodeExistUrl,
		  data: {"documentTypeCode":$("input[name=inputDocumentTypeCode]").val()},
		  success: function(data) {
				if(data.exist){
					updateInputErrMsg("รหัส "+$("input[name=inputDocumentTypeCode]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputDocumentTypeCode]"));
					passValidate=false;
				}
			},
		  dataType: "json",
		  async:false
		});
	}

	return passValidate;
}
if(viewName=="admin-document_type-add"){
}
//end admin-document_type-add

//admin-document_type-edit
function validateAdminDocumentTypeEditForm(){
	var passValidate=true;

	$("input[name=inputDocumentTypeCode]").val($.trim($("input[name=inputDocumentTypeCode]").val()));
	$("input[name=inputDocumentTypeDetail]").val($.trim($("input[name=inputDocumentTypeDetail]").val()));
	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputDocumentTypeDetail]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputDocumentTypeCode]")) && passValidate;
	
	if(passValidate){
		if($("input[name=inputDocumentTypeCode]").val()!=$("input[name=inputOldDocumentTypeCode]").val()){
			$.ajax({
			  type: 'POST',
			  url: ajaxIsDocumentTypeCodeExistUrl,
			  data: {"documentTypeCode":$("input[name=inputDocumentTypeCode]").val()},
			  success: function(data) {
					if(data.exist){
						updateInputErrMsg("รหัส "+$("input[name=inputDocumentTypeCode]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputDocumentTypeCode]"));
						passValidate=false;
					}
				},
			  dataType: "json",
			  async:false
			});
		}
	}

	return passValidate;
}
if(viewName=="admin-document_type-edit"){
}
//end admin-document_type-edit

//admin-document_type
function enableDocumentType(document_type_id,dataTable){
	showPageLoading();
	$.post(document_typeAdminEnableUrl, {"document_type_id":document_type_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ประเภทเอกสารที่เลือกถูกเปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function disableDocumentType(document_type_id,dataTable){
	showPageLoading();
	$.post(document_typeAdminDisableUrl, {"document_type_id":document_type_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ประเภทเอกสารที่เลือกถูกปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function deleteDocumentType(document_type_id,document_type_detail,dataTable){
	openModal("ยืนยันการลบ","ยืนยันการลบประเภทเอกสาร "+document_type_detail+"?",true,function(){
		showPageLoading();
		$.post(document_typeAdminDeleteUrl, {"document_type_id":document_type_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","ประเภทเอกสารถูกลบเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
if(viewName=="admin-document_type-index"){

	setTimeout(function(){
		functionInitTable();
  },100);

	var functionInitTable=function(){
		bpkDataTable=$('#admin-document_type-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.document_type_code;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.detail;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.isused=='T'){
							return '<span class="label label-success">ใช้งาน</span>';
						}
						else{
							return '<span class="label label-important">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+document_typeAdminEditUrl+'/'+full.document_type_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="icon-wrench icon-white"></i></a>';
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="deleteDocumentType(\''+full.document_type_id+'\',\''+full.detail+'\',$(\'#admin-document_type-datatable\')); return false;" class="btn btn-danger" rel="tooltip" data-title="ลบ"><i class="icon-trash icon-white"></i></a>';
					}
				},
	            {
	            	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						var returnHtml= '<div class="btn-group">'
			            		+'<a class="btn-more btn btn-info dropdown-toggle" data-toggle="dropdown" href="#">'
			            		+'	More'
			            		+'	<span class="caret"></span>'
			            		+'</a>'
			            		+'<ul class="dropdown-menu">'
			            		+'	<li>';
			            if(full.isused=="T"){
			            	returnHtml+='<a href="#" onclick="disableDocumentType(\''+full.document_type_id+'\',$(\'#admin-document_type-datatable\')); return false;"><span>ไม่ใช้งาน</span></a>';
			            }
			            else{
			            	returnHtml+='<a href="#" onclick="enableDocumentType(\''+full.document_type_id+'\',$(\'#admin-document_type-datatable\')); return false;"><span>ใช้งาน</span></a>';
			            }
			            returnHtml+='</li>'
			            		+'</ul>'
			            	+'</div>';
			            return returnHtml;
					}
	            }
	        ],
	        "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
				aoData.push( { "name": "detail", "value": $("#inputDocumentTypeDetail").val() } );
				aoData.push( { "name": "isused", "value": $("#inputDocumentTypeStatus").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-document_type-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	};
}
//end admin-document_type


//admin-document

//admin-document-add
function validateAdminDocumentAddForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputDocName]")) && passValidate;
	passValidate=checkInputTypeHidden($("input[name=inputDmsDocId]"),$("input[name=inputDmsDocId]").parent()) && passValidate;

	return passValidate;
}
if(viewName=="admin-document-add"){
	$(document).on("change","input[name^=inputHospital]",function(){
		ajaxGetSectionFromHospital($(this),$(this).parent().siblings("select.inputSectionId"),null,null);
	});
	$("input[name=inputDocAccess]").change(function(){
		if($(this).val()=="all"){
			$("#DocAccessSelectDiv").hide();
		}
		else{
			$("#DocAccessSelectDiv").show();
		}
	});
}
//end admin-document-add

//admin-document-edit
function validateAdminDocumentEditForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputDocName]")) && passValidate;
	passValidate=checkInputTypeHidden($("input[name=inputDmsDocId]"),$("input[name=inputDmsDocId]").parent()) && passValidate;

	return passValidate;
}
if(viewName=="admin-document-edit"){
	$(document).on("change","input[name^=inputHospital]",function(){
		ajaxGetSectionFromHospital($(this),$(this).parent().siblings("select.inputSectionId"),null,null);
	});
	$("input[name=inputDocAccess]").change(function(){
		if($(this).val()=="all"){
			$("#DocAccessSelectDiv").hide();
		}
		else{
			$("#DocAccessSelectDiv").show();
		}
	});
}
//end admin-document-edit

function enableDocument(docId,dataTable){
	showPageLoading();
	$.post(documentEnableUrl, {"document_id":docId}, function(data) {
		if(data.success=="OK"){
			openModal("success","เอกสารถูกเปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function disableDocument(docId,dataTable){
	showPageLoading();
	$.post(documentDisableUrl, {"document_id":docId}, function(data) {
		if(data.success=="OK"){
			openModal("success","เอกสารถูกปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function deleteDocument(docId,dataTable){
	openModal("ยืนยันการลบ","ยืนยันการลบเอกสาร รหัส "+docId+"?",true,function(){
		showPageLoading();
		$.post(documentDeleteUrl, {"document_id":docId}, function(data) {
			if(data.success=="OK"){
				openModal("success","เอกสารถูกลบเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
if(viewName=="admin-document-index"){
	$("#inputEmpHospital").change(function(){
		ajaxGetSectionFromHospital($("#inputEmpHospital"),$("#inputSectionId"),null,null);
	});
	$(document).ready(function() {
		bpkDataTable=$('#admin-document-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
        { 	"mData" : null, "sClass": "right" },
        { 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
					return full.document_id;
				}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.document_type_detail;
				} 
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.document_name;
				} 
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.file_name;
				} 
				},
				{ 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
				return (full.file_size/1024/1024).formatMoney(2,'.',',');
				} 
				},
				{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
				return full.upload_date;
				}
				},
        { "mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.isused=='T'){
							return '<span class="label label-success">ใช้งาน</span>';
						}
						else{
							return '<span class="label label-important">ไม่ใช้งาน</span>';
						}
					}
				},
	      { "mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
					return '<a target="_blank" href="'+documentAdminEditUrl+'/'+full.document_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="icon-wrench icon-white"></i></a>';
					}
				},
	      { "mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
					return '<a target="_blank" href="'+documentAdminViewUrl+'/'+full.document_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="icon-search icon-white"></i></a>';
					}
				},
        {
        	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						var returnHtml= '<div class="btn-group">'
			            		+'<a class="btn-more btn btn-info dropdown-toggle" data-toggle="dropdown" href="#">'
			            		+'	More'
			            		+'	<span class="caret"></span>'
			            		+'</a>'
			            		+'<ul class="dropdown-menu">'
			            		+'	<li>';
			            if(full.isused=="T"){
			            	returnHtml+='<a href="#" onclick="disableDocument(\''+full.document_id+'\',$(\'#admin-document-datatable\')); return false;"><span>ไม่ใช้งาน</span></a>';
			            }
			            else{
			            	returnHtml+='<a href="#" onclick="enableDocument(\''+full.document_id+'\',$(\'#admin-document-datatable\')); return false;"><span>ใช้งาน</span></a>';
			            }
			            returnHtml+='</li>';
			            returnHtml+='<li><a href="#" onclick="deleteDocument(\''+full.document_id+'\',$(\'#admin-document-datatable\')); return false;"><span>ลบ</span></a></li>'
			            returnHtml+='<li><a target="_blank" href="'+documentAdminDownloadUrl+'/'+full.document_id+'"><span>Download</span></a></li>'
			            		+'</ul>'
			            	+'</div>';
			            return returnHtml;
						}
	        }
	        ],
	        "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
	      aoData.push( { "name": "document_id", "value": $("#inputDocumentId").val() } );
	      aoData.push( { "name": "document_type_id", "value": $("#inputDocumentTypeId").val() } );
	      aoData.push( { "name": "document_name", "value": $("#inputDocumentName").val() } );
	      aoData.push( { "name": "file_name", "value": $("#inputFileName").val() } );    
	      aoData.push( { "name": "upload_date_start", "value": $("#inputDocumentUploadStart").val() } );
	      aoData.push( { "name": "upload_date_end", "value": $("#inputDocumentUploadEnd").val() } );
				aoData.push( { "name": "isused", "value": $("#inputDocumentStatus").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-document-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	});
}
//end admin-document


//admin-news_type-add
function validateAdminNewsTypeAddForm(){
	var passValidate=true;

	$("input[name=inputNewsTypeCode]").val($.trim($("input[name=inputNewsTypeCode]").val()));
	$("input[name=inputNewsTypeDetail]").val($.trim($("input[name=inputNewsTypeDetail]").val()));

	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputNewsTypeDetail]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputNewsTypeCode]")) && passValidate;
	passValidate=checkInputTypeSelect($("#inputHospitalId")) && passValidate;
	passValidate=checkInputTypeSelect($("#inputSectionId")) && passValidate;

	if(passValidate){
		$.ajax({
		  type: 'POST',
		  url: ajaxIsNewsTypeCodeExistUrl,
		  data: {"newsTypeCode":$("input[name=inputNewsTypeCode]").val()},
		  success: function(data) {
				if(data.exist){
					updateInputErrMsg("รหัส "+$("input[name=inputNewsTypeCode]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputNewsTypeCode]"));
					passValidate=false;
				}
			},
		  dataType: "json",
		  async:false
		});
	}

	return passValidate;
}
if(viewName=="admin-news_type-add"){
	$("#inputHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,null,function(){	
		});
	});
}
//end admin-news_type-add

//admin-news_type-edit
function validateAdminNewsTypeEditForm(){
	var passValidate=true;

	$("input[name=inputNewsTypeCode]").val($.trim($("input[name=inputNewsTypeCode]").val()));
	$("input[name=inputNewsTypeDetail]").val($.trim($("input[name=inputNewsTypeDetail]").val()));
	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputNewsTypeDetail]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputNewsTypeCode]")) && passValidate;
	passValidate=checkInputTypeSelect($("#inputHospitalId")) && passValidate;
	passValidate=checkInputTypeSelect($("#inputSectionId")) && passValidate;
	
	if(passValidate){
		if($("input[name=inputNewsTypeCode]").val()!=$("input[name=inputOldNewsTypeCode]").val()){
			$.ajax({
			  type: 'POST',
			  url: ajaxIsNewsTypeCodeExistUrl,
			  data: {"newsTypeCode":$("input[name=inputNewsTypeCode]").val()},
			  success: function(data) {
					if(data.exist){
						updateInputErrMsg("รหัส "+$("input[name=inputNewsTypeCode]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputNewsTypeCode]"));
						passValidate=false;
					}
				},
			  dataType: "json",
			  async:false
			});
		}
	}

	return passValidate;
}
if(viewName=="admin-news_type-edit"){
	$("#inputHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,null,function(){		
		});
	});

	ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),$("input[name=inputOldSectionId]").val(),null,function(){		
	});
}
//end admin-news_type-edit

//admin-news_type
function enableNewsType(news_type_id,dataTable){
	showPageLoading();
	$.post(news_typeAdminEnableUrl, {"news_type_id":news_type_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ประเภทข่าวสารที่เลือกถูกเปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function disableNewsType(news_type_id,dataTable){
	showPageLoading();
	$.post(news_typeAdminDisableUrl, {"news_type_id":news_type_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ประเภทข่าวสารที่เลือกถูกปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function deleteNewsType(news_type_id,news_type_detail,dataTable){
	openModal("ยืนยันการลบ","ยืนยันการลบประเภทข่าวสาร "+news_type_detail+"?",true,function(){
		showPageLoading();
		$.post(news_typeAdminDeleteUrl, {"news_type_id":news_type_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","ประเภทข่าวสารถูกลบเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
if(viewName=="admin-news_type-index"){
	$("#inputHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,null);
	});

	ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),userSectionId,'T',function(){ functionInitTable(); });

	$("#inputHospitalId").closest("form").on('reset',function() {
		setTimeout(function(){
			ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,null);
	  },100);
	});

	var functionInitTable=function(){
		bpkDataTable=$('#admin-news_type-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.hos_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.section_detail;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.news_type_code;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.detail;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.isused=='T'){
							return '<span class="label label-success">ใช้งาน</span>';
						}
						else{
							return '<span class="label label-important">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+news_typeAdminEditUrl+'/'+full.news_type_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="icon-wrench icon-white"></i></a>';
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="deleteNewsType(\''+full.news_type_id+'\',\''+full.detail+'\',$(\'#admin-news_type-datatable\')); return false;" class="btn btn-danger" rel="tooltip" data-title="ลบ"><i class="icon-trash icon-white"></i></a>';
					}
				},
	            {
	            	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						var returnHtml= '<div class="btn-group">'
			            		+'<a class="btn-more btn btn-info dropdown-toggle" data-toggle="dropdown" href="#">'
			            		+'	More'
			            		+'	<span class="caret"></span>'
			            		+'</a>'
			            		+'<ul class="dropdown-menu">'
			            		+'	<li>';
			            if(full.isused=="T"){
			            	returnHtml+='<a href="#" onclick="disableNewsType(\''+full.news_type_id+'\',$(\'#admin-news_type-datatable\')); return false;"><span>ไม่ใช้งาน</span></a>';
			            }
			            else{
			            	returnHtml+='<a href="#" onclick="enableNewsType(\''+full.news_type_id+'\',$(\'#admin-news_type-datatable\')); return false;"><span>ใช้งาน</span></a>';
			            }
			            returnHtml+='</li>'
			            		+'</ul>'
			            	+'</div>';
			            return returnHtml;
					}
	            }
	        ],
	        "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
				aoData.push( { "name": "hos_id", "value": $("#inputHospitalId").val() } );
				aoData.push( { "name": "section_id", "value": $("#inputSectionId").val() } );
				aoData.push( { "name": "detail", "value": $("#inputNewsTypeDetail").val() } );
				aoData.push( { "name": "isused", "value": $("#inputNewsTypeStatus").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-news_type-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	};
}
//end admin-news_type


//admin-report
function validateReportForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeDateBetween($("#inputDateStart"),$("#inputDateEnd")) && passValidate;
	passValidate=checkInputTypeSelect($("#inputHosId")) && passValidate;
	return passValidate;
}
if(viewName=="admin-report-index"){
	$("#inputHosId").change(function(){
		ajaxGetSectionFromHospital($("#inputHosId"),$("#inputSectionId"),null,null);
	});

	ajaxGetSectionFromHospital($("#inputHosId"),$("#inputSectionId"),userSectionId,'T', null);
}


//admin-report-project
function validateReportProjectForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeDateBetween($("#inputDateStart"),$("#inputDateEnd")) && passValidate;
	passValidate=checkInputTypeSelect($("#inputSectionId")) && passValidate;
	passValidate=checkInputTypeSelect($("#inputHosId")) && passValidate;
	return passValidate;
}
if(viewName=="admin-report-project"){
	$("#inputHosId").change(function(){
		ajaxGetSectionFromHospital($("#inputHosId"),$("#inputSectionId"),null,null);
	});

	$("#inputSectionId, #inputRequestType").change(function(){		
		ajaxGetServiceType($("#inputRequestType"),$("#inputSectionId"),$("#inputServiceType"),null,'T',function(){
			ajaxGetService($("#inputServiceType"),$("#inputService"),null,'T');
		});
	});

	ajaxGetSectionFromHospital($("#inputHosId"),$("#inputSectionId"),userSectionId,'T', null);
}


//admin-report-workforce_employee
function validateReportWorkforceEmployeeForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeDateBetween($("#inputDateStart"),$("#inputDateEnd")) && passValidate;
	passValidate=checkInputTypeSelect($("#inputSectionId")) && passValidate;
	passValidate=checkInputTypeSelect($("#inputHosId")) && passValidate;
	return passValidate;
}
if(viewName=="admin-report-workforce_employee"){
	$("#inputHosId").change(function(){
		ajaxGetSectionFromHospital($("#inputHosId"),$("#inputSectionId"),null,null);
	});

	ajaxGetSectionFromHospital($("#inputHosId"),$("#inputSectionId"),userSectionId,'T', null);
}


//admin-report-workforce_project
function validateReportWorkforceProjectForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeDateBetween($("#inputDateStart"),$("#inputDateEnd")) && passValidate;
	passValidate=checkInputTypeSelect($("#inputSectionId")) && passValidate;
	passValidate=checkInputTypeSelect($("#inputHosId")) && passValidate;
	return passValidate;
}
if(viewName=="admin-report-workforce_project"){
	$("#inputHosId").change(function(){
		ajaxGetSectionFromHospital($("#inputHosId"),$("#inputSectionId"),null,null);
	});

	ajaxGetSectionFromHospital($("#inputHosId"),$("#inputSectionId"),userSectionId,'T', null);
}


//admin-report-workforce_project
function validateReportWorkforceSlaForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeDateBetween($("#inputDateStart"),$("#inputDateEnd")) && passValidate;
	passValidate=checkInputTypeSelect($("#inputSectionId")) && passValidate;
	passValidate=checkInputTypeSelect($("#inputHosId")) && passValidate;
	return passValidate;
}
if(viewName=="admin-report-workforce_sla"){
	$("#inputHosId").change(function(){
		ajaxGetSectionFromHospital($("#inputHosId"),$("#inputSectionId"),null,null);
	});

	ajaxGetSectionFromHospital($("#inputHosId"),$("#inputSectionId"),userSectionId,'T', null);
}


//report
function validateUserReportForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeDateBetween($("#inputDateStart"),$("#inputDateEnd")) && passValidate;
	return passValidate;
}
if(viewName=="report-index"){
}


//report-bop
function initJsTreeBop(){
	$("#jstree-manage").jstree({
		"json_data" : { 
			"ajax" : {
				"type" : "post",
				"url" : ajaxGetJsTreeChildrenUrl,
				"data" : function (n) { 
					// the result is fed to the AJAX request `data` option
					// the result is fed to the AJAX request `data` option
					return { 
						"operation" : "get_children", 
						"id" : n.attr ? n.attr("id").replace("node_","") : -1 ,
						"object_type" : n.attr ? n.attr("object_type") : "section"
					}; 
				},
				success: function(data){
					// setTimeout(function(){
					// 	$("#jstree-manage").jstree("open_node", $("#node_FO13100400001"));
					// },1000);
			  }
			}
		},
		"themes" : {
	   "theme" : "default",
	   "url" : base_url+"jstree/themes/default/style.css"
	  },
		"grid": {
        "columns": [
        	{"header": "Folder/File", "width":"400", "title":"_DATA_"},
	      	// {"header": "File Type", "width":"75", "value": "file_type", "title":"file_type"},
	      	// {"header": "Folders", "width":"60", "value": "folder_count", "title":"folder_count"},
	      	// {"header": "Documents", "width":"85", "value": "doc_count", "title":"doc_count"},
	      	// {"header": "Pages", "width":"50", "value": "page_count", "title":"page_count"},
	      	// {"header": "Total Space(MB)", "width":"130", "value": "total_space", "title":"total_space"},
	      	// {"header": "Space Used(MB)", "width":"130", "value": "space_used", "title":"space_used"},
	      	// {"header": "Space Left(MB)", "width":"130", "value": "space_left", "title":"space_left"},
	      ],
	      "resizable":true
    }, 
     "core" : {
        // "initially_open" : [ "node_"+jstreeCurrentSectionId ]
    },
		"types" : {
			// I set both options to -2, as I do not need depth and children count checking
			// Those two checks may slow jstree a lot, so use only when needed
			"type_attr" : "object_type",
			"max_depth" : -2,
			"max_children" : -2,
			// I want only `drive` nodes to be root nodes 
			// This will prevent moving or creating any other type as a root node
			"valid_children" : [ "drive" ],
			"types" : {
				// The 'file' type
				"file" : {
					// I want this type to have no children (so only leaf nodes)
					// In my case - those are files
					"valid_children" : "none",
					// If we specify an icon for the file type it WILL OVERRIDE the theme icons
					"icon" : {
						"image" : jstreeIconFile
					},
					"start_drag" : false,
					"move_node" : false,
					"delete_node" : false,
					"remove" : false
				},
				// The `year` type
				"year" : {
					// can have files and other folders inside of it, but NOT `drive` nodes
					"valid_children" : [ "folder" ],
					"icon" : {
						"image" : jstreeIconRoot
					},
					"start_drag" : false,
					"move_node" : false,
					"delete_node" : false,
					"remove" : false
				},
				// The `folder` type
				"folder" : {
					// can have files and other folders inside of it, but NOT `drive` nodes
					//"valid_children" : [ "file", "folder" ],
					"valid_children" : [ "folder" ],
					"icon" : {
						"image" : jstreeIconFolder
					}
				},
				// The `drive` nodes 
				"drive" : {
					// can have files and folders inside, but NOT other `drive` nodes
					"valid_children" : [ "year" ],
					"icon" : {
						"image" : jstreeIconRoot
					},
					// those prevent the functions with the same name to be used on `drive` nodes
					// internally the `before` event is used
					"start_drag" : false,
					"move_node" : false,
					"delete_node" : false,
					"remove" : false
				}
			}
		},
		// the `plugins` array allows you to configure the active plugins on this instance
		"plugins" : ["themes","json_data","ui","crrm","hotkeys","types","sort","grid"]
	})
  .bind("click.jstree", function (e, data) {
    var node = $(e.target).closest("li");
    var id = node[0].id; //id of the selected node
    if($("#"+id).hasClass('jstree-open')){
    	$("#jstree-manage").jstree("close_node", $("#"+id));
    }
    else{
    	$("#jstree-manage").jstree("open_node", $("#"+id));
    }
    if($(node[0]).attr('object_type')=="file"){
    	window.open(base_url+$(node[0]).attr('link'));
    }
  });
}
if(viewName=="report-bop"){
	$(document).ready(function() {
		//for jstree
		initJsTreeBop();
	});
}


//report-project
function validateUserReportProjectForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeDateBetween($("#inputDateStart"),$("#inputDateEnd")) && passValidate;
	return passValidate;
}
if(viewName=="report-project"){
	$("#inputSectionId, #inputRequestType").change(function(){		
		ajaxGetServiceType($("#inputRequestType"),$("#inputSectionId"),$("#inputServiceType"),null,'T',function(){
			ajaxGetService($("#inputServiceType"),$("#inputService"),null,'T');
		});
	});
}


//report-workforce_employee
function validateUserReportWorkforceEmployeeForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeDateBetween($("#inputDateStart"),$("#inputDateEnd")) && passValidate;
	return passValidate;
}
if(viewName=="report-workforce_employee"){
}


//report-workforce_project
function validateUserReportWorkforceProjectForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeDateBetween($("#inputDateStart"),$("#inputDateEnd")) && passValidate;
	return passValidate;
}
if(viewName=="report-workforce_project"){
}


//report-workforce_project
function validateUserReportWorkforceSlaForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeDateBetween($("#inputDateStart"),$("#inputDateEnd")) && passValidate;
	return passValidate;
}
if(viewName=="report-workforce_sla"){
}


//admin-language
function confirmEditLanguage(){
	var modalElem = $('#editLangModal');
	var language_id = $("#inputEditLanguageId",modalElem).val();
	var keyword = $("#inputEditKeyword",modalElem).val();
	var text = $("#inputEditText",modalElem).val();
	$.ajax({
	  type: 'POST',
	  url: adminLanguagePostEditUrl,
	  data: {'language_id':language_id, 'keyword':keyword, 'text':text},
	  beforeSend: showPageLoading,
	  success: function(data) {
	  	if(data.error==""){
				openModal("success","บันทึกเรียบร้อย",false,null);
				$('#editLangModal').modal('hide');
				bpkDataTableSearchSubmit();
			}
			else{
				openModal("fail",data.error,false,null);
			}
		},
	  dataType: "json",
	  async:true,
	  complete: hidePageLoading
	});	
}

function openEditLangModal(elem){
	var tr = $(elem).closest('tr');
	var data = $('#admin-language-datatable').dataTable().fnGetData(tr.get(0));
	var modalElem = $('#editLangModal');
	$("#inputEditLanguageId",modalElem).val(data.language_id);
	$("#inputEditKeyword",modalElem).val(data.keyword);
	$("#inputEditTextTh",modalElem).val(data.text_th);
	$("#inputEditTextEn",modalElem).val(data.text_en);
	$("#inputEditText",modalElem).val(data.text);

	$('#editLangModal').modal({ dynamic: true });
	setTimeout(function(){
		$('#editLangModal').focus(); // add to fix bug on chrome when press esc
	},300);
}
if(viewName=="admin-language-index"){
	$(document).ready(function() {
		bpkDataTable=$('#admin-language-datatable').dataTable({
			"bJQueryUI": true,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.language_name;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.keyword;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.text_th;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.text_en;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.text;
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="openEditLangModal(this); return false;" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="icon-wrench icon-white"></i></a>';
					}
				}
	        ],
	        "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
				aoData.push( { "name": "keyword", "value": $("#inputKeyword").val() } );
				aoData.push( { "name": "text_th", "value": $("#inputTextTh").val() } );
				aoData.push( { "name": "text_en", "value": $("#inputTextEn").val() } );
				aoData.push( { "name": "text", "value": $("#inputText").val() } );
				aoData.push( { "name": "language_id", "value": $("#inputLanguageId").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		bpkDataTable.dataTable().fnSetFilteringDelay(sSearchDelay);

		$("#table-language-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	});
}
//end admin-language


//admin-language-import
function adminLanguageImportInitDatatable(data,pass_validate){
  if($('#import-datatable').hasClass('dataTable')){
    $('#import-datatable').dataTable().fnDestroy();
  } 

  var aaSorting=[];
  if(!pass_validate){
    aaSorting=[[ 6, "desc" ]];
  }

  $('#import-datatable').dataTable({
    "bJQueryUI": true,
    "sPaginationType": "full_numbers",
    "aoColumnDefs": dataTableCustomColumnDef,
    "aoColumns": [
            {   "mData" : null, "sClass": "right" },
            {   "mData" : null,
          "mRender": function ( data, type, full ) {
            return full.language_name;
          }
        },
              {   "mData" : null,
          "mRender": function ( data, type, full ) {
            return full.keyword;
          }
        },
              {   "mData" : null,
          "mRender": function ( data, type, full ) {
            return full.text_th;
          }
        },
              {   "mData" : null,
          "mRender": function ( data, type, full ) {
            return full.text_en;
          }
        },
              {   "mData" : null,
          "mRender": function ( data, type, full ) {
            return full.text;
          }
        },
              {   "mData" : null, "sClass": "center",
          "mRender": function ( data, type, full ) {
            if(full.validate=="-ผ่าน-"){
              return '<span class="label label-success">'+full.validate+'</span>';
            }
            else{
              return '<span class="label label-important">'+full.validate+'</span>';
            }
          }
        }
      ],
        "aaSorting": aaSorting,
    "bProcessing": true,
    "bServerSide": false,
    "aaData": data,
    "bFilter": false,
    "bInfo": false,
    "bPaginate": false,
    "sDom": 'lfrtip',
    "fnDrawCallback": function ( oSettings ) {
      bpkDataTableDrawCallback(oSettings,null,true,null,true);
    }
  });
}
function _submitAdminLanguageImportForm(){
  var options = { 
      //target:        '#output2',   // target element(s) to be updated with server response 
      beforeSubmit:  function(){
        showPageLoading();
      },  // pre-submit callback 
      success:       function(data){
        if(data.error!=""){
          openModal("fail",data.error,false,null);
        }
        else{
          if($("#inputSubmitType").val()=="validate"){
            scrollToElem($("#import-datatable"));
            adminLanguageImportInitDatatable(data.data,data.pass_validate);
          }
          else if($("#inputSubmitType").val()=="submit"){
          	openModal("success","บันทึกสำเร็จ",false,null);
          	adminLanguageImportInitDatatable(new Array(),true);
          }
        }
      },
      complete: function(){
        hidePageLoading();
      },
      type:      'post',        // 'get' or 'post', override for form's 'method' attribute 
      dataType:  'json',        // 'xml', 'script', or 'json' (expected server response type) 
      clearForm: false,        // clear all form fields after successful submit 
      resetForm: false         // reset the form after successful submit 

      // $.ajax options can be used here too, for example: 
      //timeout:   3000 
  }; 

  // bind to the form's submit event 
  $('#form-admin-import-language').ajaxSubmit(options);
}
function submitAdminLanguageImportForm(){
  $("#inputSubmitType").val("submit");
  _submitAdminLanguageImportForm();
}
function validateAdminLanguageImportFile(){
  $("#inputSubmitType").val("validate");
  _submitAdminLanguageImportForm();
}
if(viewName=="admin-language-import"){
  adminLanguageImportInitDatatable(new Array());
}
//end admin-language-import


function bi_changeSrc(object_label,param) 
{ 
	// var object_label='ws__42137640';
	// var object_label='cockpit__768900985'; //monthly
	// document.getElementById("myframe").src="http://192.168.13.39:8080/SpagoBI/servlet/AdapterHTTP?NEW_SESSION=true&ACTION_NAME=EXECUTE_DOCUMENT_ACTION&TOOLBAR_VISIBLE=false&OBJECT_LABEL="+object_label+"&PARAMETERS=FromDate%3D"+"09/05/2016"+"%26"+"ToDate%3D"+"09/05/2016"; 
	
	document.getElementById("myframe").src="http://192.168.13.39:8080/SpagoBI/servlet/AdapterHTTP?NEW_SESSION=true&ACTION_NAME=EXECUTE_DOCUMENT_ACTION&TOOLBAR_VISIBLE=true&OBJECT_LABEL="+object_label+"&PARAMETERS="+param; 
	// document.getElementById("myframe").src="http://localhost:8080/SpagoBI/servlet/AdapterHTTP?NEW_SESSION=true&ACTION_NAME=EXECUTE_DOCUMENT_ACTION&TOOLBAR_VISIBLE=true&OBJECT_LABEL="+object_label+"&PARAMETERS="+param; 
} 
function bi_changeWidth() 
{ 
	document.getElementById("myframe").width="100%"; 
	document.getElementById("myframe").height="700"; 
} 
function bi_bodyOnload(object_label,param){
	setTimeout(function(){
		bi_changeSrc(object_label,param);
	},0);

	setTimeout(bi_changeWidth,1000)
}

function openBiPdf(object_label,param){	
	/*if(object_label=='form-bill'){
		var str = jQuery.param(param);
		window.open(printJasperPdfUrl+"?jasper_report_id="+object_label+"&"+str);
	}*/
	var str = jQuery.param(param);
	window.open(printJasperPdfUrl+"?jasper_report_id="+object_label+"&"+str);
	return;
}

function openBiXlsx(object_label,param){	
	/*if(object_label=='form-bill'){
		var str = jQuery.param(param);
		window.open(printJasperPdfUrl+"?jasper_report_id="+object_label+"&"+str);
	}*/
	var str = jQuery.param(param);
	window.open(printJasperXlsxUrl+"?jasper_report_id="+object_label+"&"+str);
	return;
}

function openBiXls(object_label,param){	
	/*if(object_label=='form-bill'){
		var str = jQuery.param(param);
		window.open(printJasperPdfUrl+"?jasper_report_id="+object_label+"&"+str);
	}*/
	var str = jQuery.param(param);
	window.open(printJasperXlsUrl+"?jasper_report_id="+object_label+"&"+str);
	return;
}


///////////////put this at the bottom of file////////////

$(function(){
	//showhide cookie
	for(var i in showHideCookie){
		if(i.indexOf('showhide_'+viewName+'_filter_')!=-1){
			var prefix='showhide_'+viewName+'_filter_';
			var containerClass=i.substr(prefix.length);
			var nth=parseInt(containerClass);
			if($("#container div.filter-box").size()>nth){
				var elem=$('#container div.filter-box').eq(nth);
				var showButton=elem.find('div.filter-show-hide .show-filter-button');
				var hideButton=elem.find('div.filter-show-hide .hide-filter-button');

				if(showHideCookie[i]){
					elem.find(".filter-content").show();
					showButton.hide();
					hideButton.show();
				}
				else{
					elem.find(".filter-content").hide();
					showButton.show();
					hideButton.hide();
				}
			}
		}
		else if(i.indexOf('showhide_'+viewName+'_')!=-1){
			var prefix='showhide_'+viewName+'_';
			var containerClass=i.substr(prefix.length);
			if($("div."+containerClass).size()>0){
				var showButton=$('div[data-container='+containerClass+']').children(".btn-show");
				var hideButton=$('div[data-container='+containerClass+']').children(".btn-hide");
				if(showHideCookie[i]){
					$("div."+containerClass).show();
					hideButton.show();
					showButton.hide();
				}
				else{
					$("div."+containerClass).hide();
					hideButton.hide();
					showButton.show();
				}
			}
		}
	}
});

//check browser
// jQuery.browser={};(function(){jQuery.browser.msie=false;
// jQuery.browser.version=0;if(navigator.userAgent.match(/MSIE ([0-9]+)\./)){
// jQuery.browser.msie=true;jQuery.browser.version=RegExp.$1;}})();

// if ( $.browser.msie ) {
// 	//alert( $.browser.version );
// }
//end check browser

if ($("#sessionMsgAlertModal").size()>0){	
	$('#sessionMsgAlertModal').modal({
		'backdrop':true
	});
}

//page loading
function showPageLoading(){
	$("div.page-loading").show();
	$("#page-overlay").show();	
}

function hidePageLoading(){
	$("div.page-loading").hide();
	$("#page-overlay").hide();
}

$(document).ready(function() {
  $('#main-menu').metisMenu();
	hidePageLoading();
} );
//end page loading
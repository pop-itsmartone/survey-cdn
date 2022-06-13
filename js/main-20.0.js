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

var ieVersion=null;
if(navigator.appVersion.match(/MSIE ([\d.]+)/)!=null){
	var ieVersion=navigator.appVersion.match(/MSIE ([\d.]+)/)[1];
}

var notSupportIEText="Feature นี้ไม่ support IE ที่ต่ำกว่า version 8. กรุณาใช้งานด้วย Firefox, Chrome, หรือ IE 8 ขึ้นไป";

//cookie
$.cookie.json = true;
var showHideCookie=$.cookie('bpk_hd_showhide');
if (showHideCookie===undefined){
	showHideCookie={};
}

Selectize.define('restore_on_backspace', function(options) {
	var self = this;

	options.text = options.text || function(option) {
		return option[this.settings.labelField];
	};

	this.onKeyDown = (function() {
		var original = self.onKeyDown;
		return function(e) {
			var index, option;
			if (e.keyCode === 8 && this.$control_input.val() === '' && !this.$activeItems.length) {
				index = this.caretPos - 1;
				if (index >= 0 && index < this.items.length) {
					option = this.options[this.items[index]];
					if (this.deleteSelection(e)) {
						this.setTextboxValue(options.text.apply(this, [option]));
						this.refreshOptions(true);
					}
					e.preventDefault();
					return;
				}
			}
			return original.apply(this, arguments);
		};
	})();
});


//clear selectize
function clearSelectize(selectize){	
	selectize.clearOptions();
	selectize.clear();
	selectize.close();
}
function clearSelectize2(selectize){	
	selectize.clear();
	selectize.close();
}

function initSelectize(elem){
	var sortField = 'text';
	if(elem.hasClass('no-sort')){
		sortField='';
	}
	elem.selectize({
	    create: true,
	    sortField: sortField
	});
}

function initSelectizeNoCreate(elem){
	var sortField = 'text';
	if(elem.hasClass('no-sort')){
		sortField='';
	}
	elem.selectize({
	    create: false,
	    sortField: sortField
	});
}

function initSelectizeRemote2(elem, max_items, value_field, label_field, search_field, code_field, is_show_code, url,changeFunction,paramKeys,paramElems,changeFunctionParam1, options, restore_on_backspace){
	var plugins={};
	if(restore_on_backspace==null || restore_on_backspace){
		plugins = {
		  'restore_on_backspace': {}
		}
	}
	$newSelectize=$(elem).selectize({
    // persist: (options!=null && options.persist==true) ? true : false,
    persist: (options!=null && options.persist==false) ? false : true,
    createOnBlur: (options!=null && options.createOnBlur==true) ? true : false,
		maxItems: max_items,
    valueField: value_field,
    labelField: label_field,
    searchField: search_field,
    plugins: plugins,
    create: (options!=null && options.can_create==true) ? true : false,
    preload: 'focus',
    render: {
    	item: function(item, escape) {
    		if(is_show_code){
          return '<div>' +
                (item[code_field] ? '<span>' + item[code_field] + ' - ' + escape(item[label_field]) + '</span>' : '') +
          '</div>';
      	}
      	else{
          return '<div>' +
              (item[label_field] ? '<span>' + escape(item[label_field]) + '</span>' : '') +
          '</div>';
        }
    	},
      option: function (item, escape) {
      	if(is_show_code){
          var label = item[code_field]+' - '+item[label_field];
        }
        else{
          var label = item[label_field];
        }
        return '<div>' +
            '<span class="label">' + escape(label) + '</span>' +
        '</div>';
      }
    },
    load: function(query, callback) {
      // if (!query.length) 
      // 	return callback();

      var jsonParams={q:query,page_limit:20};
      if(paramKeys!=null){
      	for(var i in paramKeys){
      		if(paramElems[i].indexOf('fix_value=')!='-1'){
      			jsonParams[paramKeys[i]]=paramElems[i].substring("fix_value=".length);
      		}
      		else{
      			jsonParams[paramKeys[i]]=$(paramElems[i]).val();
      		}
      	}
      }
      $.get(url,jsonParams,function(data){
      	  var obj = jQuery.parseJSON(data);
      	  callback(obj);
      })
      
  	},
  	onInitialize: function(){  
    },
    onChange: function(value) {
    	if(changeFunction){
      	window[changeFunction]($("option:selected",elem).text(),$("option:selected",elem).val(),changeFunctionParam1,this.options[value]);
    	}
    }
	});
	return $newSelectize;
}

function initSelectizeLocal(elem, max_items, value_field, label_field, search_field, optionList, is_show_code){
	$newSelectize=$(elem).selectize({
    persist: true,
    maxItems: max_items,
    valueField: value_field,
    labelField: label_field,
    searchField: search_field,
    options: optionList,
    render: {
        item: function(item, escape) {
        	if(is_show_code){
            return '<div>' +
                (item[value_field] ? '<span>' + item[value_field] + ' - ' + escape(item[label_field]) + '</span>' : '') +
            '</div>';
        	}
        	else{
            return '<div>' +
                (item[label_field] ? '<span>' + escape(item[label_field]) + '</span>' : '') +
            '</div>';
          }
        },
        option: function(item, escape) {
        	if(is_show_code){
            var label = item[value_field]+' - '+item[label_field];
          }
          else{
            var label = item[label_field];
          }
          return '<div>' +
              '<span class="label">' + escape(label) + '</span>' +
          '</div>';
        }
    },
    onInitialize: function(){
    }
	});

	return $newSelectize;
}

$(document).ready(function() {
	$.ajaxSetup({ cache: false });
	$('[rel=tooltip]').tooltip();
	$('.combobox').combobox({highlighter: function(item){ return item; }});
	initSelectize($('.selectized'));
	initSelectizeNoCreate($('.selectized-nocreate'));
	initAjaxTypeahead();
	initShowHideSection();
	initDateOrDateTimePicker();
	initButtonCloseWindow();
	updateOpenerWindowDataTable();
	initCheckboxCancelExistingImage();
	initCheckboxRemoveAttachment();
	initInputPosInteger();
	initInputPosDecimal();

	$('#tabs').on('click', 'li', function(event) {
		$(this).parent().toggleClass('in');
		$('.dt-responsive').each(function(index, el) {
			setTimeout(function(){
				if ($(el).DataTable().responsive) {
				    $(el).DataTable().responsive.recalc();
				}
			}, 5);
		});
	});
} );

function initTab(){
	$('#tabs').on('click', 'li', function(event) {
		$(this).parent().toggleClass('in');
		$('.dt-responsive').each(function(index, el) {
			setTimeout(function(){
				if ($(el).DataTable().responsive) {
				    $(el).DataTable().responsive.recalc();
				}
			}, 5);
		});
	});
}

function inJSONArray(value,json){
	for(var i in json){
		if(json[i]==value) return 0;
	}
	return -1;
}

function nl2br (str, is_xhtml) {
	if(str==null) return '';
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

function initInputPosInteger(elem){
	if(elem==null){
		elem=$('body');
	}
	$(".pos-integer",elem).numeric({ decimal:false, negative : false });
}

function initInputPosIntegerByElem(elem){
	$(elem).numeric({ decimal:false, negative : false });
}

function initInputPosDecimal(elem){
	if(elem==null){
		elem=$('body');
	}
	$(".pos-decimal",elem).numeric({ decimal:".", negative : false });
	$(".pos-decimal-withcomma",elem).numeric({ decimal:".", negative : false, withcomma : true });
}

function initInputPosDecimalByElem(elem){
	$(elem).numeric({ decimal:".", negative : false });
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
function playVideoPopup(link){
	var html5Video='<video width="100%" autoplay controls src="'+link+'">'
  +'<source src="'+link+'" type="video/mp4">'
  +'Your browser does not support the video tag.'
  +'</video>'
	openModal("Video Player",html5Video);
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


function showError(message){
	openModal("fail",message,false,null);
}

function getFnServerParams(aoData,form){
	var fields=$("#form-search").find("input, select, textarea");
	$.each(fields, function(){
		var name = $(this).attr('name');
		if(name!=null){
			if($(this).attr('type')=='checkbox' && $(this).is(':checked')==false){
			}
			else{
				var value = $(this).val();
			  aoData.push( { "name": name, "value": value } );
			}
		}
	});
	return aoData;
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
	dataTable.find('th input.dt-checkbox').unbind();
	dataTable.find('th input.dt-checkbox').prop('checked',false);
	dataTable.find('th input.dt-checkbox').change(function() {
		if(this.checked) {
			dataTable.find('td input.dt-checkbox').not('.disabled').prop('checked',true);
		}
		else{
			dataTable.find('td input.dt-checkbox').not('.disabled').prop('checked',false);
		}
		if(onDTCheckboxChangeFunction!=null){
			setTimeout(onDTCheckboxChangeFunction, 10);
		}
	});

	dataTable.find('td input.dt-checkbox').unbind();
	dataTable.find('td input.dt-checkbox').change(function() {
		if(!this.checked) {
			dataTable.find('th input.dt-checkbox').prop('checked',false);
		}
		if(onDTCheckboxChangeFunction!=null){
			setTimeout(onDTCheckboxChangeFunction, 10);
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

function isNullOrEmpty(val){
	if(val==null || val==''){
		return true;
	}
	else return false;
}

function initDateOrDateTimePicker(elem){
	if(elem==null){ 
		elem=$('body');
	}

	$('.monthpicker',elem).datetimepicker({
	  format: 'YYYY-MM',
    showTodayButton: true,
    showClear: true,
    showClose: true,
    toolbarPlacement: 'top',
	  viewMode: 'months'
	}).on('dp.change', function(e) {
		$('input[type=text]',this).change();
	});

	$('.datepicker',elem).datetimepicker({
	    format: 'YYYY-MM-DD',
	    showTodayButton: true,
	    showClear: true,
	    showClose: true,
	    toolbarPlacement: 'top'
	}).on('dp.change', function(e) {
		$('input[type=text]',this).change();
	});

	$('.datetimepicker',elem).each(function(){
		$(this).datetimepicker({
		    format: !$(this).attr('format')?"YYYY-MM-DD HH:mm:ss":$(this).attr('format'),
		    showTodayButton: true,
		    showClear: true,
		    showClose: true,
		    toolbarPlacement: 'top'
		}).on('dp.change', function(e) {
			$('input[type=text]',this).change();
		});
	});

	$('.timepicker',elem).datetimepicker({
	   	format: 'HH:mm',
	    showTodayButton: true,
	    showClear: true,
	    showClose: true,
	    toolbarPlacement: 'top'
	}).on('dp.change', function(e) {
		$('input[type=text]',this).change();
	});

	$('.datepicker, .datetimepicker, .timepicker',elem).find(".glyphicon-remove").parent().unbind().click(function(){
		$(this).closest("div.input-group").find("input").val("");
		$(this).closest("div.input-group").find("input").change();
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
		var fileUploadDivElem=$(elem).closest("div.fileinput");
		if($(elem).closest("div.fileinput").is(".fileinput-last")){
			var newElem=$(elem).closest("div.fileinput").clone();
			fileUploadDivElem.removeClass("fileinput-last");
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

function toBpkHN (hn) {
	hn=hn.replace(/-/g,"");
	if(hn==null || hn=="") return "";
	if(hn.length<=4) return "";
	if(hn.length>9){
		return hn.substr(0,1)+'-'+hn.substr(1,2)+'-'+hn.substr(-6);
	}
	else{
		return hn.substr(0,1)+'-'+hn.substr(1,2)+'-'+hn.substr(3);
	}
}

function toBpkVN (vn) {
	if(vn==null || vn=="") return "";
   //imed: 5901010295
	return parseInt(vn.substr(6))+'/'+vn.substr(4,2)+vn.substr(2,2)+vn.substr(0,2); //bpk: 295/010159
}

function toBpkAN (an) {
	if(an==null || an=="") return "";
   //imed: 590000001
	return an.substr(0,2)+"/"+an.substr(3); //bpk: 59/000001
}

//Datatable
var bpkDataTable=null;
var dataTableCustomColumnDef=[
	{ "responsivePriority": 1, "targets": 0 },
	{ "responsivePriority": 2, "targets": -1 },
	{ "bSortable": false, "aTargets": [ "sort-false" ] },
	{ "bSearchable": false, "aTargets": [ "search-false" ] }
];

var sSearchDelay=500;


function bpkDataTableDrawCallback(oSettings,defaultOrderNumber,noRefresh,orderNumberColumn,refreshFunction){
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
	var dataTableWrapper=$(oSettings.nTable).closest('.dataTables_wrapper');

	if(noRefresh==null || !noRefresh){
		//check if first init
		if($('.dataTables_length button.datatable-refresh-btn',dataTableWrapper).size()==0){
			$('.dataTables_length',dataTableWrapper).prepend(
				$('<button class="btn btn-default datatable-refresh-btn"><i class="glyphicon glyphicon-refresh"></i></button>')
					.click(function(){
						if(refreshFunction!=null){
							refreshFunction();
						}
						else{
							bpkDataTableSearchSubmit($(oSettings.nTable).DataTable());
						}
					}));
		}
	}
}

function bpkDataTableSearchSubmit(dataTable){
	if(dataTable==null) dataTable=bpkDataTable;
	dataTable.ajax.reload();
	// var oSetting =dataTable.dataTable().fnSettings();
	// oSetting._iDisplayStart = 0;
	// dataTable.dataTable()._fnAjaxUpdate();
}
function bpkDataTableSearchSubmit2(dataTableId){
	var dataTable=$("#"+dataTableId);
	if(dataTable==null) return;
	bpkDataTableSearchSubmit(dataTable.DataTable());
}

function addTaskActionProblem(elem){
	var elemDetailClone=$(".problem-detail:last").clone();
	elemDetailClone.find('div.combobox-container').remove();
	elemDetailClone.find('.combobox').each(function(){
		$(this).attr('name',$(this).attr('attr-name'));
		$(this).show();
		$(this).combobox({highlighter: function(item){ return item; }});
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
	var formGroup = $(elem).closest('.form-group');
	if(formGroup.hasClass('last') && $(elem).val()!=''){
		var elemDetailClone=$(".previous-task.last").clone();
		elemDetailClone.find('div.combobox-container').remove();
		elemDetailClone.find('.combobox').each(function(){
			$(this).attr('name',$(this).attr('attr-name'));
			$(this).show();
			$(this).combobox({highlighter: function(item){ return item; }});
		});
		formGroup.after(elemDetailClone);
		formGroup.removeClass('last');
		formGroup.find(".btn.remove").removeClass('hide');
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
	var controlGroup=$(elem).closest('div.form-group');
	controlGroup.find('.view-only').val($(elem).val());
	if($(elem).val()!="-1"){
		if(controlGroup.hasClass('last')){
			var controlGroupClone=$(elem).closest('div.form-group').clone();
			controlGroupClone.find('div.combobox-container').remove();
			controlGroupClone.find('.view-only').val("");
			controlGroupClone.find('.combobox').each(function(){
				$(this).attr('name',$(this).attr('attr-name'));
				$(this).show();
				if($(this).hasClass('inputSectionId')){
					$('option' ,this).not('.first-option').remove();
				}
				$(this).combobox({highlighter: function(item){ return item; }});
			});
			controlGroup.after(controlGroupClone);
			controlGroup.removeClass('last');
			controlGroup.find('.btn.remove').removeClass('hide');
		}
	}

}

function removeSection(elem){
	var controlGroup=$(elem).closest('div.form-group');
	controlGroup.remove();
}

function addMoreEmpGroup(elem){
	var controlGroup=$(elem).closest('div.form-group');
	controlGroup.find('.view-only').val($(elem).val());
	if($(elem).val()!="-1"){
		if(controlGroup.hasClass('last')){
			var controlGroupClone=$(elem).closest('div.form-group').clone();
			controlGroupClone.find('div.combobox-container').remove();
			controlGroupClone.find('.view-only').val("");
			controlGroupClone.find('.combobox').each(function(){
				$(this).attr('name',$(this).attr('attr-name'));
				$(this).show();
				$(this).combobox({highlighter: function(item){ return item; }});
			});
			controlGroup.after(controlGroupClone);
			controlGroup.removeClass('last');
			controlGroup.find('.btn.remove').removeClass('hide');
		}
	}
}

function removeEmpGroup(elem){
	var controlGroup=$(elem).closest('div.form-group');
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
	elemHead.find(".change").removeClass("hide");
	elemHead.find(".remove").removeClass("hide");
	elemHead.find(".select").addClass("hide");
	var elemWsId=elemHead.find(".inputWsItemId");
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
	var elemParent=$(elem).closest(".item-detail");
	var elemGrandParent=$(elem).closest(".form-group");
	if(type=="project"){
		$(elem).after('<input type="hidden" name="inputRemovingProjectWsItemId[]" class="removingProjectWsItemId" value="'+$(elem).attr('project-wsitem-id')+'" />');
	}
	else{
		$(elem).after('<input type="hidden" name="inputRemovingTaskWsItemId[]" class="removingTaskWsItemId" value="'+$(elem).attr('task-wsitem-id')+'" />');
	}
	elemParent.siblings(".control-label").addClass("line-through").addClass("muted");
	elemParent.find("label,span").addClass("line-through").addClass("muted");
	elemGrandParent.nextAll(".form-group").slice(0, 2).find("label,span").addClass("line-through").addClass("muted");
	//elemGrandParent.next(".control-group").next(".control-group").find("label,span").addClass("line-through").addClass("muted");
	elemParent.children(".cancel-remove").show();
	elemParent.children(".cancel-remove").removeClass('hide');
	$(elem).hide();
}
function cancelRemoveExistWsItem(elem,type){
	if(type==null) type="task";
	var elemParent=$(elem).closest(".item-detail");
	var elemGrandParent=$(elem).closest(".form-group");
	if(type=="project"){
		elemParent.find(".removingProjectWsItemId").remove();
	}
	else{
		elemParent.find(".removingTaskWsItemId").remove();
	}
	elemParent.siblings(".control-label").removeClass("line-through").removeClass("muted");
	elemParent.find("label,span").removeClass("line-through").removeClass("muted");
	elemGrandParent.nextAll(".form-group").slice(0, 2).find("label,span").removeClass("line-through").removeClass("muted");
	//elemGrandParent.next(".control-group").next(".control-group").find("label,span").removeClass("line-through").removeClass("muted");
	elemParent.children(".remove").show();
	elemParent.children(".cancel-remove").addClass('hide');
	$(elem).hide();
}
//end select wsitem function


//select employee function
var selectingEmployeeElem=null;
var selectingEmployeeElem2=null;
var typeAheadUpdaterCheck=false;
function initSelectEmployeeTypeahead(elem){
	elem.typeahead({
		updater: function(item) {
			// do what you want with the item here
			if(!typeAheadUpdaterCheck){
				typeAheadUpdaterCheck=true;
				var spacePos=item.indexOf(" - ");
				var emp_id=item.substring(0,spacePos);
				selectingEmployeeElem=$(elem).parent().find('button.btn.select');
				selectingEmployeeElem2=$(elem);
				$.ajax({
					type: 'POST',
					url: ajaxGetEmpDataUrl,
					data:  {"emp_id":emp_id},
					dataType: "json",
					async:true,
					success: function(data) {
						selectEmployeeCallback(emp_id,data.ename+" "+data.esurname,data.hos_detail,data.section_detail,data.position,data.section_id);
					}
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
	var elemParent=$(elem).closest('.form-group');

	// if last, clone and append empty elem
	if(selectingEmployeeElem2!=null && selectingEmployeeElem2.closest('.form-group').find(".inputHiddenEmpId").size()>0){
		selectingEmployeeElem2.closest('.form-group').find(".inputHiddenEmpId").val(emp_id);
	}
	if(elemParent.find(".inputTaskCoInchargeEmpId").size()>0 && $(elemHead).hasClass("last")){
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
	else if(elemParent.find(".inputProjectCoInchargeEmpId").size()>0 && $(elemHead).hasClass("last")){
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
	else if(elemParent.find(".inputProjectApproverEmpId").size()>0 && $(elemHead).hasClass("last")){
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
	elemParent.find(".change").removeClass("hide");
	elemParent.find(".remove").removeClass("hide");
	elemParent.find(".select").addClass("hide");
	var elem=selectingEmployeeElem;
	if(elemParent.find(".inputTaskCoInchargeEmpId").size()>0){
		var elemEmpId=elemParent.find(".inputTaskCoInchargeEmpId");
		elemEmpId.val(emp_id);
		elemDetail.find("span.inputEmpName").html(emp_name);
		elemDetail.find("span.inputEmpHospital").html(hos_detail);
		elemDetail.find("span.inputEmpSection").html(section_detail);
		elemDetail.find("span.inputEmpPosition").html(position);
		$(elem).parent().find('.view-only').val(emp_id);
	}
	else if(elemParent.find(".inputProjectCoInchargeEmpId").size()>0){
		var elemEmpId=elemParent.find(".inputProjectCoInchargeEmpId");
		elemEmpId.val(emp_id);
		elemDetail.find("span.inputEmpName").html(emp_name);
		elemDetail.find("span.inputEmpHospital").html(hos_detail);
		elemDetail.find("span.inputEmpSection").html(section_detail);
		elemDetail.find("span.inputEmpPosition").html(position);
		$(elem).parent().find('.view-only').val(emp_id);
	}
	else if(elemParent.find(".inputProjectApproverEmpId").size()>0){
		var elemEmpId=elemParent.find(".inputProjectApproverEmpId");
		elemEmpId.val(emp_id);
		elemDetail.find("span.inputEmpName").html(emp_name);
		elemDetail.find("span.inputEmpHospital").html(hos_detail);
		elemDetail.find("span.inputEmpSection").html(section_detail);
		elemDetail.find("span.inputEmpPosition").html(position);
		$(elem).parent().find('.view-only').val(emp_id);
	}
	else{
		var elemEmpId=elemParent.find(".inputEmployeeId");
		elemEmpId.val(emp_id);
		elemDetail.find("span.inputEmpName").html(emp_name);
		elemDetail.find("input[name=inputInChargeEmpName]").val(emp_name);
		$("#inputInChargeEmpSectionId").val(section_id);
		elemDetail.find("span.inputEmpHospital").html(hos_detail);
		elemDetail.find("span.inputEmpSection").html(section_detail);
		elemDetail.find("span.inputEmpPosition").html(position);
		elemDetail.find("span.inputEmpEmail").closest('.col-md-6').hide();
		elemDetail.find("span.inputEmpPhone").closest('.col-md-6').hide();

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
	var elemParent=$(elem).closest('.form-group');
	elemParent.find(".change").addClass("hide");
	elemParent.find(".remove").addClass("hide");
	elemParent.find(".select").removeClass("hide");
	elemParent.find(".inputSelectEmployeeTypeahead").val('');
	if(elemParent.find(".inputTaskCoInchargeEmpId").size()>0){
		var elemEmpId=elemParent.find(".inputTaskCoInchargeEmpId");
		elemEmpId.val("");
		elemDetail.find("span.inputEmpName").html("");
		elemDetail.find("span.inputEmpHospital").html("");
		elemDetail.find("span.inputEmpSection").html("");
		elemDetail.find("span.inputEmpPosition").html("");
		$(elem).parent().find('.view-only').val("");
	}
	else if(elemParent.find(".inputProjectCoInchargeEmpId").size()>0){
		var elemEmpId=elemParent.find(".inputProjectCoInchargeEmpId");
		elemEmpId.val("");
		elemDetail.find("span.inputEmpName").html("");
		elemDetail.find("span.inputEmpHospital").html("");
		elemDetail.find("span.inputEmpSection").html("");
		elemDetail.find("span.inputEmpPosition").html("");
		$(elem).parent().find('.view-only').val("");
	}
	else if(elemParent.find(".inputProjectApproverEmpId").size()>0){
		var elemEmpId=elemParent.find(".inputProjectApproverEmpId");
		elemEmpId.val("");
		elemDetail.find("span.inputEmpName").html("");
		elemDetail.find("span.inputEmpHospital").html("");
		elemDetail.find("span.inputEmpSection").html("");
		elemDetail.find("span.inputEmpPosition").html("");
		$(elem).parent().find('.view-only').val("");
	}
	else{
		var elemEmpId=elemParent.find(".inputEmployeeId");
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
	var elemParent=$(elem).closest('.form-group');
	elemParent.find(".change").removeClass("hide");
	elemParent.find(".remove").removeClass("hide").parent().removeClass('hide');
	elemParent.find(".select").addClass("hide");
	var elemRefProjectId=elemParent.find(".inputRefProjectId");
	elemRefProjectId.val(project_id);
	var elemRefProjectTitle=elemParent.find(".refProjectTitle");
	elemRefProjectTitle.prev('.input-group-btn').remove();
	elemRefProjectTitle.before('<div class="input-group-btn"><a href="'+projectViewUrl+'/'+project_id+'" target="_blank" class="btn btn-primary btn-mini pull-left"><i class="glyphicon glyphicon-search"></i> View</a></div>');
	elemRefProjectTitle.html(project_id+ '-' +title);
	elemRefProjectTitle.removeClass("hide").closest('.hidden').removeClass('hidden');
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
	var elemParent=$(elem).closest('.form-group');
	elemParent.find(".change").addClass("hide");
	elemParent.find(".remove").addClass("hide");
	elemParent.find(".input-group-btn").addClass("hide");
	elemParent.find(".select").removeClass("hide");
	var elemRefProjectId=elemParent.find(".inputRefProjectId");
	elemRefProjectId.val("");
	var elemRefProjectTitle=elemParent.find(".refProjectTitle");
	elemRefProjectTitle.html('');
	elemRefProjectTitle.addClass("hide");
}
//end select project function


//input validation
function updateInputErrMsg(errMsg,inputField){
	if(errMsg!=""){
		$(inputField).closest("div.form-group").addClass('has-error');
		if($(inputField).closest("div.form-group").find('span.help-inline').size()!=0){
			$(inputField).closest("div.form-group").find('span.help-inline').text(errMsg);
		}
		else{
			$(inputField).closest("div.form-group").find('span.help-block').text(errMsg);
		}
		focusAndScrollToElem($(inputField));
	}
	else{
		$(inputField).closest("div.form-group").removeClass('has-error');
		if($(inputField).closest("div.form-group").find('span.help-inline').size()!=0){
			$(inputField).closest("div.form-group").find('span.help-inline').text("");
		}
		else{
			$(inputField).closest("div.form-group").find('span.help-block').text("");
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

function checkInputTypeCheckbox(inputField,focusTarget){
	var passValidate=true;
	var errMsg="";
	if(inputField.is(":checked")==false){
		errMsg="กรุณาเลือก";
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
	openModalViewFullDetail(nl2br($(elem).attr('attr-detail')));
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

function clearComboBox(elem){
	$(elem).data('combobox').clearElement();
	$(elem).data('combobox').clearTarget();
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
//end ajax get workstation

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

//ajax get service_point_from_emp
function ajaxGetServicePoint2(sectionId,servicePointId,inputServicePointElem,defaultValue,isUsed,onComplete){
	
	if(isUsed==null) isUsed="null";
	if(servicePointId==null) servicePointId="null";
	showPageLoading();
	$.post(ajaxGetServicePoint2Url, {"sectionId":sectionId,"servicePointId":servicePointId ,"isused":isUsed}, function(data) {
		var optionHtml='';
		if(servicePointId!=null && servicePointId!="" && servicePointId!="null"){
			inputServicePointElem.combobox('disable');
		}
		else{
			inputServicePointElem.combobox('enable');
		}
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
//end ajax get service_point_from_emp

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

function clear_form_elements(element) {
  $(element).find(':input').each(function() {
    switch(this.type) {
        case 'password':
        case 'text':
        case 'textarea':
        case 'file':
        case 'select-one':       
            jQuery(this).val('');
            break;
        case 'checkbox':
        case 'radio':
            $(this).prop('checked', false);
    }
  });
}

function disable_form_elements(element) {
  $(element).find(':input').each(function() {
    switch(this.type) {
        case 'password':
        case 'text':
        case 'textarea':
        case 'file':
        case 'select-one':       
            $(this).prop('disabled', true);
            break;
        case 'checkbox':
        case 'radio':
            $(this).prop('disabled', true);
    }
  });
}


function readonly_form_elements(element) {
  $(element).find(':input').each(function() {
    switch(this.type) {
        case 'password':
        case 'text':
        case 'textarea':
        case 'file':
        case 'select-one':       
            $(this).prop('readonly', true);
            break;
        case 'checkbox':
        case 'radio':
            $(this).prop('readonly', true);
            break;
    }
  });
  element.find('select').prop('disabled',true);
  element.find('select').each(function(){
  	if($(this).hasClass('selectized')){
  		$(this).get(0).selectize.disable();
  	}
  })
}


//nav-bar
function openModalSwitchSection(){
	$('#switchSectionModal').modal({ dynamic: true, backdrop: true });
	setTimeout(function(){
		$('#switchSectionModal').focus(); // add to fix bug on chrome when press esc
	},300);
}
function switchSectionConfirm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeSelect($("select[id=inputSwitchSection]")) && passValidate;

	if(passValidate){
		showPageLoading();
		var arr=$("#inputSwitchSection").val().split(";;");
		var sectionId=arr[0];
		var servicePointId=$("#inputSwitchServicePoint").val();
		if(servicePointId=='') servicePointId="null";
		window.location.href = switchSectionUrl+"/"+sectionId+"/"+servicePointId;
	}
}
$(function(){	
	$("#inputSwitchSection").change(function(){
		var arr=$("#inputSwitchSection").val().split(";;");
		var sectionId=arr[0];
		var servicePointId=arr[1];
		ajaxGetServicePoint2(sectionId,servicePointId,$("#inputSwitchServicePoint"),servicePointId,'T');
	});

	var sectionId=userSectionId;
	var servicePointId=userServicePointId;
	// ajaxGetServicePoint2(sectionId,servicePointId,$("#inputSwitchServicePoint"),servicePointId,'T');
});


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
	var bpkDataTableHistory=$('#wsitem-history-datatable').DataTable({
		"bFilter": false,
		"responsive": true,
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

//admin-wsitem-write_off
function wsItemWriteOffModalConfirm(){
	var passValidate = validateAdminWsItemWriteOffForm();
	if(passValidate){
  	var confirmText="ยืนยันบันทึก";
		openModal(confirmText,confirmText+"?",true,function(){
			$.ajax({
				type: 'POST',
				url: assetPostWriteOffUrl,
				data:  "emp_id="+userEmpId+"&"+$('#form-write-off-modal').serialize(),
				success: function(data) {
					if(data.error!=''){
						openModal("fail",data.error,false,null);
					}
					else{
	        	$('#wsItemWriteOffModal').modal('hide');
	      		openModal("success","บันทึกสำเร็จ",false,null);
						bpkDataTableSearchSubmit2('asset-datatable');
					}
				},
				dataType: "json",
				async:false
			});
		});
	}
}
function validateAdminWsItemWriteOffForm(){
	var writeOffModal = $("#wsItemWriteOffModal");
  var passValidate=true;
  //check input bottom up 
  
  if($("input[name=inputIsCutOff]:checked",writeOffModal).size()==0){
  	passValidate = false;
		openModal("fail","กรุณาเลือก ขาย หรือ ตัดจำหน่าย",false,null);
  }    
  else if($("#inputShopDate",writeOffModal).val()>$("#inputWriteOffDate",writeOffModal).val()){
  	passValidate = false;
		openModal("fail","ระบุวันที่ขาย/ตัดจำหน่ายผิดพลาด ห้ามมาก่อนวันที่ซื้อ/ได้มา",false,null);
  }

  if(passValidate){
		var isCutOff = $("input[name=inputIsCutOff]:checked",writeOffModal).val();
    if(isCutOff=='T'){
  		passValidate=checkInputTypeText($("input[name=inputWriteOffDate]",writeOffModal)) && passValidate;
			updateInputErrMsg('',$("input[name=inputSellPrice]",writeOffModal));
			updateInputErrMsg('',$("input[name=inputBuyerName]",writeOffModal));
			updateInputErrMsg('',$("select[id=inputDrAcccode]",writeOffModal));
    }
    else if(isCutOff=='F'){
    	passValidate=checkInputTypeText($("input[name=inputSellPrice]",writeOffModal)) && passValidate;
    	passValidate=checkInputTypeText($("input[name=inputBuyerName]",writeOffModal)) && passValidate;
    	passValidate=checkInputTypeSelect($("select[id=inputDrAcccode]",writeOffModal)) && passValidate;
  		passValidate=checkInputTypeText($("input[name=inputWriteOffDate]",writeOffModal)) && passValidate;
    }
    else return false;
  }

  return passValidate;
}
function wsItemWriteOffGetAccDp(){
	var writeOffDate = $("#inputWriteOffDate",writeOffModal).val();
 	$.ajax({
		type: 'GET',
		url: apiAssetWriteOffGetAccDpUrl,
		data: {"wsitem_id":$("#inputWsItemId",writeOffModal).val(), 'write_off_date':writeOffDate},
		success: function(data) {
			if(data.error!=''){
				openModal("fail",data.error,false,null);
			}
			else{
				$("#inputAssetCost",writeOffModal).val(data.asset_cost.formatMoney(2,'.',','));
				$("#inputAccDp",writeOffModal).val(data.acc_dp.formatMoney(2,'.',','));
			}
			wsItemWriteOffGetProfitLoss();
		},
		dataType: "json",
		async:false
	});
}
function wsItemWriteOffGetProfitLoss(){
	var sellPrice = $("#inputSellPrice",writeOffModal).val();
	var assetCost = $("#inputAssetCost",writeOffModal).val();
	sellPrice = sellPrice.replace(/,/g,'');
	assetCost = assetCost.replace(/,/g,'');
	var profitLoss = '';
	if(sellPrice!='' && assetCost!=''){
		profitLoss = (parseFloat(sellPrice)-parseFloat(assetCost)).formatMoney(2,'.',',');
	}
	$("#inputProfitLoss",writeOffModal).val(profitLoss);
}
//end admin-wsitem-write_off
function openWsItemWriteOffModal(wsitem_id){
	$("input[type=text]",writeOffModal).val('');
	$("#inputIsCutOff_F",writeOffModal).prop('checked',true);
	$("#inputIsCutOff_F",writeOffModal).trigger('click');
	$("#inputWriteOffDate",writeOffModal).trigger('change');
 	$.ajax({
		type: 'GET',
		url: apiAssetGetDataUrl,
		data: {"wsitem_id":wsitem_id},
		success: function(data) {
			if(data.error!=''){
				openModal("fail",data.error,false,null);
			}
			else{
				var wsitem_data = data.data.wsitem_data;
				$("#inputWsItemId",writeOffModal).val(wsitem_data.wsitem_id);
				$("#inputShopDate",writeOffModal).val(wsitem_data.shop_date);
				$("#inputAccId",writeOffModal).val(wsitem_data.acc_id);
				$("#inputAccDetail",writeOffModal).val(wsitem_data.acc_detail);
				$("#inputAssetType",writeOffModal).val(wsitem_data.asset_type_desc);
				$("#inputDepartment",writeOffModal).val(wsitem_data.department_desc);
			}

			$('#wsItemWriteOffModal').modal({ dynamic: true, backdrop: false });
			setTimeout(function(){
				$('#wsItemWriteOffModal').focus(); // add to fix bug on chrome when press esc
			},300);
		},
		dataType: "json",
		async:false
	});
}

function wsItemRemoveModalConfirm(){
	var passValidate = validateAdminWsItemRemoveForm();
	if(passValidate){
  	var confirmText="ยืนยันบันทึก";
		openModal(confirmText,confirmText+"?",true,function(){
			$.ajax({
				type: 'POST',
				url: assetPostRemoveUrl,
				data:  "emp_id="+userEmpId+"&"+$('#form-remove-modal').serialize(),
				success: function(data) {
					if(data.error!=''){
						openModal("fail",data.error,false,null);
					}
					else{
	        	$('#wsItemRemoveModal').modal('hide');
	      		openModal("success","บันทึกสำเร็จ",false,null);
						bpkDataTableSearchSubmit2('asset-datatable');
					}
				},
				dataType: "json",
				async:false
			});
		});
	}
}
function validateAdminWsItemRemoveForm(){
	var removeModal = $("#wsItemRemoveModal");
  var passValidate=true;
  //check input bottom up 
  
  passValidate=checkInputTypeText($("input[name=inputRemoveReason]",removeModal)) && passValidate;

  return passValidate;
}
function openWsItemRemoveModal(wsitem_id){
	var removeModal = $("#wsItemRemoveModal");
	$("input[type=text]",removeModal).val('');
 	$.ajax({
		type: 'GET',
		url: apiAssetGetDataUrl,
		data: {"wsitem_id":wsitem_id},
		success: function(data) {
			if(data.error!=''){
				openModal("fail",data.error,false,null);
			}
			else{
				var wsitem_data = data.data.wsitem_data;
				$("#inputWsItemId",removeModal).val(wsitem_data.wsitem_id);
				$("#inputAccId",removeModal).val(wsitem_data.acc_id);
				$("#inputAccDetail",removeModal).val(wsitem_data.acc_detail);
				$("#inputAssetType",removeModal).val(wsitem_data.asset_type_desc);
				$("#inputDepartment",removeModal).val(wsitem_data.department_desc);
			}

			$('#wsItemRemoveModal').modal({ dynamic: true, backdrop: false });
			setTimeout(function(){
				$('#wsItemRemoveModal').focus(); // add to fix bug on chrome when press esc
			},300);
		},
		dataType: "json",
		async:false
	});
}

if(viewName=="asset-index"){
	var writeOffModal = $("#wsItemWriteOffModal");
	$("input[name=inputIsCutOff]",writeOffModal).click(function(){
		var isCutOff = $("input[name=inputIsCutOff]:checked",writeOffModal).val();
		if(isCutOff=='T'){
			$("#inputBuyerName",writeOffModal).val('ตัดชำรุด');
			$("#inputSellPrice",writeOffModal).val('0');
			$("#inputSellPrice",writeOffModal).trigger('keyup');
			$("#inputBuyerName",writeOffModal).prop('readonly',true);
			$("#inputSellPrice",writeOffModal).prop('readonly',true);
			var selectize = $("#inputDrAcccode",writeOffModal).get(0).selectize;
			selectize.clear();
			selectize.close();
			$("#inputDrAcccode",writeOffModal).get(0).selectize.disable();
		}
		else{
			$("#inputBuyerName",writeOffModal).val('');
			$("#inputBuyerName",writeOffModal).prop('readonly',false);
			$("#inputSellPrice",writeOffModal).prop('readonly',false);
			var selectize = $("#inputDrAcccode",writeOffModal).get(0).selectize;
			selectize.clear();
			selectize.close();
			$("#inputDrAcccode",writeOffModal).get(0).selectize.enable();
		}
	});

	$("#inputWriteOffDate",writeOffModal).change(function(){
		wsItemWriteOffGetAccDp();
	});

	$("#inputSellPrice",writeOffModal).keyup(function(){
		wsItemWriteOffGetProfitLoss();
	});

	// $("#inputEmpHospital").change(function(){
	// 	ajaxGetSectionFromHospital($("#inputEmpHospital"),$("#inputSectionId"),null,null);
	// });

	// $("#inputEmpHospital").val(userHosId);
	// ajaxGetSectionFromHospital($("#inputEmpHospital"),$("#inputSectionId"),null,'T',null);


	// $("#inputEmpHospital").closest("form").on('reset',function() {
	// 	setTimeout(function(){
	// 		ajaxGetSectionFromHospital($("#inputEmpHospital"),$("#inputSectionId"),null,null);
	//   },100);
	// });
	$(document).ready(function() {
		bpkDataTable=$('#asset-datatable').DataTable({
			"responsive": false,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
				{ 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.acc_id;
					}
				},
				{ 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.asset_type_name;
					}
				},
				{ 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.acc_detail;
					}
				},
				{ 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.shop_date;
					}
				},
	            { 	"mData" : null, "sClass": "right",
					"mRender": function ( data, type, full ) {
						return parseFloat(full.shop_p).formatMoney(2,'.',',');
					}
				},
	            { 	"mData" : null, "sClass": "right",
					"mRender": function ( data, type, full ) {
						return parseFloat(full.dp_amt).formatMoney(2,'.',',');
					}
				},
				{ 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.department_id;
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
						if(full.isused=='F'){
							return '<span class="label label-danger">ไม่ใช้งาน</span>';
						}
						else if(full.isused=='S'){
							return '<span class="label label-danger">จำหน่าย</span>';
						}
						return full.wsitem_status_detail;
					}
				},
	            { 	"mData" : null, "sClass": "right",
					"mRender": function ( data, type, full ) {
						if(full.warranty_month==null) return '';
						return full.warranty_month;
					}
				},
				{ 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						var returnHtml = '<a target="_blank" href="'+assetManageUrl+'/'+full.wsitem_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';

            return returnHtml;
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
			      if(full.isused=='T' && (inJSONArray("ASSET_ADMIN",session_app_permission_include) != -1 || inJSONArray("ASSET_LOW_VALUE",session_app_permission_include) != -1)){
            	returnHtml+='<li><a target="_blank" href="'+wsitemAdminEditUrl+'/'+full.wsitem_id+'"><span>แก้ไข</span></a></li>';
			        returnHtml+='<li><a target="_blank" href="'+wsitemAdminEditUrl+'/'+full.wsitem_id+'?is_copy=T"><span>Copy</span></a></li>';			            
			        if(full.acc_dp==null || full.acc_dp==0){
            		returnHtml+='<li><a href="#" onclick="openWsItemRemoveModal(\''+full.wsitem_id+'\'); return false;"><span>ยกเลิกทรัพย์สิน</span></a></li>';
            	}
            }
			      if(full.isused=='T' && full.dp_start_date!=null && inJSONArray("ASSET_WRITE_OFF",session_app_permission_include) != -1){
            	returnHtml+='<li><a href="#" onclick="openWsItemWriteOffModal(\''+full.wsitem_id+'\'); return false;"><span>ตัดจำหน่าย</span></a></li>';
			      }
			      if(full.acc_id!=null && full.acc_id!=''){
			      	returnHtml+='<li><a target="_blank" href="'+apiAssetGenQrUrl+'/'+full.wsitem_id+'?is_print=T"><span>พิมพ์ QR</span></a></li>';			
			      }            

            returnHtml+='</ul>'
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
      	aoData = getFnServerParams(aoData,$("#form-search"));
				// aoData.push( { "name": "wsitem_id", "value": $("#inputItemId").val() } );
				// aoData.push( { "name": "ws_id", "value": $("#inputWsId").val() } );
				// aoData.push( { "name": "hos_id", "value": '' } );
				// aoData.push( { "name": "itemtype_id", "value": $("#inputItemTypeId").val() } );
				// aoData.push( { "name": "brand", "value": $("#inputItemBrand").val() } );
				// aoData.push( { "name": "model", "value": $("#inputItemModel").val() } );
				// aoData.push( { "name": "serial", "value": $("#inputItemSerial").val() } );
				// aoData.push( { "name": "acc_id", "value": $("#inputItemAccId").val() } );
				// aoData.push( { "name": "med_id", "value": $("#inputItemMedId").val() } );
				// aoData.push( { "name": "incharge_emp_name", "value": $("#inputInchargeEmpName").val() } );
				// aoData.push( { "name": "wsitem_status_id", "value": $("#inputWsItemStatusId").val() } );
				// aoData.push( { "name": "item_view_type", "value": $("#inputItemViewtype").val() } );				
				// aoData.push( { "name": "can_borrow", "value": $("#inputCanBorrow").val() } );
	   //    aoData.push( { "name": "section_id", "value": $("#inputSectionId").val() } );
	   //    aoData.push( { "name": "hos_id", "value": $("#inputEmpHospital").val() } );
	   //    aoData.push( { "name": "warranty_month", "value": $("#inputWarrantyMonth").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		$("#table-asset-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	});
}
//end asset


//asset-close_period
function validateAssetClosePeriodForm(){
	if(isConfirmClosePeriod) return true;

	var passValidate=true;
	passValidate=checkInputTypeText($("input[name=inputCloseDate]")) && passValidate;
	passValidate=checkInputTypeHidden($("input[name=inputBranchcode]")) && passValidate;
	if(passValidate){
		if($("input[name=inputCloseDate]").val() <= lastMonthlyClose){
			openModal("fail","กรุณาเลือกเดือนให้ถูกต้อง",false,null);		
			passValidate=false;	
		}
	}
	if(passValidate){
  	var confirmText="ยืนยันบันทึก";
		openModal(confirmText,confirmText+"?",true,function(){
			showPageLoading();
			isConfirmClosePeriod = true;
			$("#form-monthly_close").submit();
		});
	}
	return false;
}
//end asset-close_period


//asset-gr_item
if(viewName=="asset-gr_item"){
	var bpkDataTable=$('#report-datatable').DataTable({
		"bFilter": true,
		"responsive": false,
		"searchDelay": sSearchDelay,
		"sPaginationType": "full_numbers",
		"aoColumnDefs": dataTableCustomColumnDef,
		"aoColumns": [
      { 	"mData" : null, "sClass": "right"	},
			{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.gr_code;
				}
			},
			{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.distributor_id+' - '+full.distributor_name;
				}
			},
			{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.base_drug_type_desc;
				}
			},
			{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.item_code;
				}
			},
			{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.item_name;
				}
			},
			{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.po_code;
				}
			},
			{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.invoice_number;
				}
			},
			{ 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
					return full.unit_ratio;
				}
			},
			{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.unit_text;
				}
			},
			{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.lot_number;
				}
			},
			{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
					return full.expire_date;
				}
			},
			{ 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
					return parseFloat(full.price_per_unit).formatMoney(2,'.',',');
				}
			},
      { 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.create_by_emp_name;
				}
			},
			{ 	"mData" : null, "sClass": "left",
				"mRender": function ( data, type, full ) {
					if(full.receive_date==null) return '';
					return full.receive_date.substring(0,10);
				}
			},
			{ 	"mData" : null, "sClass": "left",
				"mRender": function ( data, type, full ) {
					if(full.create_date==null) return '';
					return full.create_date.substring(0,10);
				}
			},
            { 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
					if(full.wsitem_id!=null){
						return '<span class="label label-success" style="font-size:12px; width:50px;">Done</span>';
					}
					return '';
				}
			},
			{ 	"mData" : null , "sClass": "center",
				"mRender": function ( data, type, full ) {
					var returnHtml = '<a target="_blank" href="'+wsitemAdminAddFromGrUrl+'/'+full.gr_item_id+'" class="btn btn-primary">นำเข้า</a>';

          return returnHtml;
				}
			},
    ],
    "aaSorting": [[ 1, "desc" ]],
		"bProcessing": true,
		"bServerSide": true,
		"sAjaxSource": dataTableAjaxSourceUrl,
		"sServerMethod": "POST",
		"fnServerParams": function ( aoData ) {
			aoData = getFnServerParams(aoData,$("#form-search"));
		},
		"fnDrawCallback": function ( oSettings ) {
			bpkDataTableDrawCallback(oSettings);
		},
		"iDisplayLength": 50,
		'fixedHeader': true
	});
	$("#table-report-index-submit").click(function(){
		bpkDataTableSearchSubmit(bpkDataTable);
		return false;
	});
}
//end asset-gr_item


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
			var bpkDataTableRequest=$('#request-borrow-datatable').DataTable({
				"responsive": true,
				"searchDelay": sSearchDelay,
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
							return '<a href="'+borrowViewUrl+'/'+full.wsitem_borrow_id+'" target="_blank" class="btn btn-primary" rel="tooltip" data-title="ดูรายละเอียด"><i class="glyphicon glyphicon-search"></i></a>';
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

			$("#table-request-submit").click(function(){
				bpkDataTableSearchSubmit(bpkDataTableRequest);
				return false;
			});
		};

		//Table Waiting Return
		var functionInitTableWaiting=function(){
			var bpkDataTableWaiting=$('#waiting-borrow-datatable').DataTable({
				"responsive": true,
				"searchDelay": sSearchDelay,
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
							return '<a href="'+borrowViewUrl+'/'+full.wsitem_borrow_id+'" target="_blank" class="btn btn-primary" rel="tooltip" data-title="ดูรายละเอียด"><i class="glyphicon glyphicon-search"></i></a>';
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

			$("#table-waiting-submit").click(function(){
				bpkDataTableSearchSubmit(bpkDataTableWaiting);
				return false;
			});
		};

		//Table Borrow Search
		var functionInitTableSearch=function(){
			var bpkDataTableSearch=$('#search-borrow-datatable').DataTable({
				"responsive": true,
				"searchDelay": sSearchDelay,
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
							return '<a href="'+borrowViewUrl+'/'+full.wsitem_borrow_id+'" target="_blank" class="btn btn-primary" rel="tooltip" data-title="ดูรายละเอียด"><i class="glyphicon glyphicon-search"></i></a>';
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

			$("#table-search-submit").click(function(){
				bpkDataTableSearchSubmit(bpkDataTableSearch);
				return false;
			});
		};
}
//end borrow-index


//interface_ins-index
if(viewName=="interface_ins-index"){
  $(function(){
    bpkDataTable=$('#report-datatable').DataTable({
      "responsive": true,
      "searchDelay": sSearchDelay,
      "sPaginationType": "full_numbers",
      "aoColumnDefs": dataTableCustomColumnDef,
      "aoColumns": [
        {   "mData" : null, "sClass": "right" },
        {   "mData" : null, "sClass": "center bold",
          "mRender": function ( data, type, full ) {
            return toBpkHN(full.hn);
          }
        },
        {   "mData" : null, "sClass": "center bold",
          "mRender": function ( data, type, full ) {
            if(full.an!=null && full.an!=''){
              return toBpkAN(full.an);
            }
            return toBpkVN(full.vn);
          }
        },
        {   "mData" : null, "sClass": "left bold",
          "mRender": function ( data, type, full ) {
            return full.patient_name;
          }
        },
        {   "mData" : null, "sClass": "center",
          "mRender": function ( data, type, full ) {
            return full.visit_date;
          }
        },
        {   "mData" : null, "sClass": "center",
          "mRender": function ( data, type, full ) {
            return full.visit_type_name_en;
          }
        },
        {   "mData" : null, "sClass": "center",
          "mRender": function ( data, type, full ) {
            return full.admit_date;
          }
        },
        {   "mData" : null, "sClass": "left",
          "mRender": function ( data, type, full ) {
            return full.patient_age;
          }
        },
        {   "mData" : null, "sClass": "left",
          "mRender": function ( data, type, full ) {
            return full.gender_name;
          }
        },
              {   "mData" : null , "sClass": "center",
          "mRender": function ( data, type, full ) {
            return '<a target="_blank" href="'+interfaceAiaUrl+'/'+full.visit_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
          }
        }
      ],
      "aaSorting": [[ 4, "desc" ]],
      "bProcessing": true,
      "bServerSide": true,
      "sAjaxSource": dataTableAjaxSourceUrl,
      "sServerMethod": "POST",
      "fnServerParams": function ( aoData ) {
        aoData = getFnServerParams(aoData,$("#form-search"));
      },
      "fnDrawCallback": function ( oSettings ) {
        bpkDataTableDrawCallback(oSettings);
      }
    });

    $("#table-report-submit").click(function(){
      bpkDataTableSearchSubmit();
      return false;
    });
  });
}
//end interface_ins-index


//checkup-detail
function validateCheckupDetailForm(){
	var passValidate=true;

	var form = $("#form-checkup-detail");

	$("#inputName",form).val($.trim($("#inputName",form).val()));

	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputName]",form)) && passValidate;
	passValidate=checkInputTypeSelect($("select[name=inputCompanyName]",form)) && passValidate;
	passValidate=checkInputTypeSelect($("select[name=inputType]",form)) && passValidate;

	return passValidate;
}
function checkupDetailFormSubmit(){
	var passValidate = validateCheckupDetailForm();
	var form = $("#form-checkup-detail");
	if(passValidate){
		$.ajax({
			type: 'POST',
			url: checkupSaveUrl,
			data:  new FormData(form.get(0)),
			dataType: "json",
			processData: false,
    	contentType: false,
			async:true,
	    beforeSubmit:  function(){
	      showPageLoading();
	    },
			success: function(output) {
	      hidePageLoading();
	      if(output.error!=''){
					openModal("fail",output.error,false,null);
	      }
	      else{
					openModal("success","Save Complete.",false,null);
					setTimeout(function(){
		      	var checkup_data = output.checkup_data;
						window.location.href = checkupDetailUrl+'/'+checkup_data.checkup_id;
					},1000);
	      }
			}
		});
	}
}
function checkupDetailFormClear(){
	var form = $("#form-checkup-detail");
	$("input[type=text]",form).val('');
	$("textarea",form).val('');
	$("#inputIsused",form).val('T');

	var selectize = $("#inputCompanyName",form).get(0).selectize;
	clearSelectize2(selectize);

	var selectize = $("#inputType",form).get(0).selectize;
	clearSelectize2(selectize);

	var selectize = $("#inputLocation",form).get(0).selectize;
	clearSelectize2(selectize);

	var selectize = $("#inputPayment",form).get(0).selectize;
	clearSelectize2(selectize);

	var selectize = $("#inputMealCoupon",form).get(0).selectize;
	clearSelectize2(selectize);
}
function checkupDetailFormGetData(checkupId){
	checkupDetailFormClear();
	$.ajax({
		type: 'GET',
		url: checkupGetUrl,
		data:  {'checkup_id':checkupId},
		dataType: "json",
		async:true,
    beforeSubmit:  function(){
      showPageLoading();
    },
		success: function(output) {
      hidePageLoading();
      if(output.error!=''){
				openModal("fail",output.error,false,null);
      }
      else{
      	var checkup_data = output.checkup_data;

				var form = $("#form-checkup-detail");
				$("input[type=text]",form).val('');
				$("textarea",form).val('');
				$("#inputIsused",form).val('T');

				var selectize = $("#inputCompanyName",form).get(0).selectize;
				selectize.addOption({'value':checkup_data.company_name,'text':checkup_data.company_name});
				selectize.setValue(checkup_data.company_name);

      	$("#inputName",form).val(checkup_data.name);
      	$("#inputPrice",form).val(checkup_data.price);
      	$("#inputAddress",form).val(checkup_data.address);
      	$("#inputCoordinator",form).val(checkup_data.coordinator);

				var selectize = $("#inputType",form).get(0).selectize;
				selectize.setValue(checkup_data.type);

      	$("#inputDateStart",form).val(checkup_data.date_start);
      	$("#inputDateEnd",form).val(checkup_data.date_end);

				var selectize = $("#inputLocation",form).get(0).selectize;
				selectize.setValue(checkup_data.location);

				var selectize = $("#inputPayment",form).get(0).selectize;
				selectize.setValue(checkup_data.payment);

				var selectize = $("#inputMealCoupon",form).get(0).selectize;
				selectize.setValue(checkup_data.meal_coupon);

      	$("#inputCodeText",form).val(checkup_data.code_text);
      	$("#inputOther",form).val(checkup_data.other);
      	$("#inputOfficer",form).val(checkup_data.officer);
      	$("#inputOfficerPhone",form).val(checkup_data.officer_phone);
      	$("#inputIsused",form).val(checkup_data.isused);
      }
		}
	});
}
if(viewName=="checkup-detail"){
	$(function(){
		checkupDetailFormClear();
		var form = $("#form-checkup-detail");
		var checkupId = $("#inputCheckupId",form).val();
		if(checkupId!=''){
			checkupDetailFormGetData(checkupId);
		}
		else{
     	$("#inputOfficer",form).val(userEmpName);
		}
	});
}
//end checkup-edit

//checkup
function enableCheckup(checkup_id,dataTable){
	showPageLoading();
	$.post(checkupEnableUrl, {"checkup_id":checkup_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ข้อมูลที่เลือกถูกเปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function disableCheckup(checkup_id,dataTable){
	showPageLoading();
	$.post(checkupDisableUrl, {"checkup_id":checkup_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ข้อมูลที่เลือกถูกปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function deleteCheckup(checkup_id,name,dataTable){
	openModal("ยืนยันการลบ","ยืนยันการลบข้อมูล "+name+"?",true,function(){
		showPageLoading();
		$.post(checkupDeleteUrl, {"checkup_id":checkup_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","ข้อมูลถูกลบเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
if(viewName=="checkup-index"){
	$(function(){
		bpkDataTable=$('#report-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.checkup_code;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.company_name;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.name;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.checkup_type_name;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.date_start;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.date_end;
					}
				},
	     	{ "mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.isused=='T'){
							return '<span class="label label-success">ใช้งาน</span>';
						}
						else{
							return '<span class="label label-danger">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
			      if(inJSONArray("CHECKUP_EDIT",session_app_permission_include) != -1){
							return '<a target="_blank" href="'+checkupDetailUrl+'/'+full.checkup_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="glyphicon glyphicon-wrench"></i></a>';
			      }
						return '<a target="_blank" href="'+checkupDetailUrl+'/'+full.checkup_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
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
			            if(inJSONArray("CHECKUP_EDIT",session_app_permission_include) != -1){
				            if(full.isused=="T"){
				            	returnHtml+='<a href="#" onclick="disableCheckup(\''+full.checkup_id+'\',$(\'#report-datatable\').DataTable()); return false;"><span>ไม่ใช้งาน</span></a>';
				            }
				            else{
				            	returnHtml+='<a href="#" onclick="enableCheckup(\''+full.checkup_id+'\',$(\'#report-datatable\').DataTable()); return false;"><span>ใช้งาน</span></a>';
				            }
				            returnHtml+='<a href="#" onclick="deleteCheckup(\''+full.checkup_id+'\',\''+full.checkup_code+'\',$(\'#report-datatable\').DataTable()); return false;"><span>ลบ</span></a>';
				          }
									returnHtml+='<a href="'+checkupViewUrl+'/'+full.checkup_id+'" target="_blank"><span>View</span></a>';
									returnHtml+='<a href="'+checkupPrintUrl+'/'+full.checkup_id+'" target="_blank"><span>Print</span></a>';
			            returnHtml+='</li>'
			            		+'</ul>'
			            	+'</div>';
			            return returnHtml;
					}
	      }
	        ],
	        "aaSorting": [[ 1, "desc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
        aoData = getFnServerParams(aoData,$("#form-search"));
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		$("#table-report-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	});
}
//end checkup

//package
if(viewName=="package-index"){
	$(function(){
		bpkDataTable=$('#report-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.package_code;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.package_name;
					}
				},
	            { 	"mData" : null, "sClass": "right",
					"mRender": function ( data, type, full ) {
						if(full.package_price==null) return '';
						return parseFloat(full.package_price).formatMoney(2,'.',',');
					}
				},
	            { 	"mData" : null, "sClass": "right",
					"mRender": function ( data, type, full ) {
						if(full.added_value==null) return '';
						return parseFloat(full.added_value).formatMoney(2,'.',',');
					}
				},
	            { 	"mData" : null,"sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.effective_date==null) return '';
						return full.effective_date;
					}
				},
	            { 	"mData" : null,"sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.expire_date==null) return '';
						return full.expire_date;
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
						returnHtml+='<li><a href="'+packageViewUrl+'/'+full.item_set_id+'" target="_blank"><span>View</span></a></li>';
						returnHtml+='<li><a href="'+packagePrintUrl+'/'+full.item_set_id+'" target="_blank"><span>Print</span></a></li>';
            returnHtml+='</ul>'
            	+'</div>';
            return returnHtml;
					}
	      }
	        ],
	        "aaSorting": [[ 5, "desc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
        aoData = getFnServerParams(aoData,$("#form-search"));
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		$("#table-report-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	});
}
//end package


//ins_benefits-detail
function validateInsBenefitsDetailForm(){
	var passValidate=true;

	var form = $("#form-ins_benefits-detail");

	$("#inputName",form).val($.trim($("#inputName",form).val()));

	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputName]",form)) && passValidate;
	passValidate=checkInputTypeSelect($("select[name=inputCompanyName]",form)) && passValidate;

	return passValidate;
}
function insBenefitsDetailFormSubmit(){
	var passValidate = validateInsBenefitsDetailForm();
	var form = $("#form-ins_benefits-detail");
	if(passValidate){
		$.ajax({
			type: 'POST',
			url: insBenefitsSaveUrl,
			data:  new FormData(form.get(0)),
			dataType: "json",
			processData: false,
    	contentType: false,
			async:true,
	    beforeSubmit:  function(){
	      showPageLoading();
	    },
			success: function(output) {
	      hidePageLoading();
	      if(output.error!=''){
					openModal("fail",output.error,false,null);
	      }
	      else{
					openModal("success","Save Complete.",false,null);
					setTimeout(function(){
		      	var ins_benefits_data = output.ins_benefits_data;
						window.location.href = insBenefitsDetailUrl+'/'+ins_benefits_data.ins_benefits_id;
					},1000);
	      }
			}
		});
	}
}
function insBenefitsDetailFormClear(){
	var form = $("#form-ins_benefits-detail");
	$("input[type=text]",form).val('');
	$("textarea",form).val('');
	$("#inputIsused",form).val('T');

	var selectize = $("#inputCompanyName",form).get(0).selectize;
	clearSelectize2(selectize);
}
function insBenefitsDetailFormGetData(ins_benefits_id){
	insBenefitsDetailFormClear();
	$.ajax({
		type: 'GET',
		url: insBenefitsGetUrl,
		data:  {'ins_benefits_id':ins_benefits_id},
		dataType: "json",
		async:true,
    beforeSubmit:  function(){
      showPageLoading();
    },
		success: function(output) {
      hidePageLoading();
      if(output.error!=''){
				openModal("fail",output.error,false,null);
      }
      else{
      	var ins_benefits_data = output.ins_benefits_data;

				var form = $("#form-ins_benefits-detail");
				$("input[type=text]",form).val('');
				$("textarea",form).val('');
				$("#inputIsused",form).val('T');

				var selectize = $("#inputCompanyName",form).get(0).selectize;
				selectize.addOption({'value':ins_benefits_data.company_name,'text':ins_benefits_data.company_name});
				selectize.setValue(ins_benefits_data.company_name);

      	$("#inputName",form).val(ins_benefits_data.name);
      	$("#inputPrice",form).val(ins_benefits_data.price);
      	$("#inputAddress",form).val(ins_benefits_data.address);
      	$("#inputCoordinator",form).val(ins_benefits_data.coordinator);

      	$("#inputDateStart",form).val(ins_benefits_data.date_start);
      	$("#inputDateEnd",form).val(ins_benefits_data.date_end);

      	$("#inputCodeText",form).val(ins_benefits_data.code_text);
      	$("#inputDetail",form).val(ins_benefits_data.detail);
      	$("#inputOfficer",form).val(ins_benefits_data.officer);
      	$("#inputOfficerPhone",form).val(ins_benefits_data.officer_phone);
      	$("#inputIsused",form).val(ins_benefits_data.isused);
      }
		}
	});
}
if(viewName=="ins_benefits-detail"){
	$(function(){
		insBenefitsDetailFormClear();
		var form = $("#form-ins_benefits-detail");
		var ins_benefitsId = $("#inputInsBenefitsId",form).val();
		if(ins_benefitsId!=''){
			insBenefitsDetailFormGetData(ins_benefitsId);
		}
		else{
     	$("#inputOfficer",form).val(userEmpName);
		}
	});
}
//end ins_benefits-edit

//ins_benefits
function enableInsBenefits(ins_benefits_id,dataTable){
	showPageLoading();
	$.post(ins_benefitsEnableUrl, {"ins_benefits_id":ins_benefits_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ข้อมูลที่เลือกถูกเปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function disableInsBenefits(ins_benefits_id,dataTable){
	showPageLoading();
	$.post(ins_benefitsDisableUrl, {"ins_benefits_id":ins_benefits_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ข้อมูลที่เลือกถูกปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function deleteInsBenefits(ins_benefits_id,name,dataTable){
	openModal("ยืนยันการลบ","ยืนยันการลบข้อมูล "+name+"?",true,function(){
		showPageLoading();
		$.post(ins_benefitsDeleteUrl, {"ins_benefits_id":ins_benefits_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","ข้อมูลถูกลบเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
if(viewName=="ins_benefits-index"){
	$(function(){
		bpkDataTable=$('#report-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.ins_benefits_code;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.company_name;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.name;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.date_start;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.date_end;
					}
				},
	     	{ "mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.isused=='T'){
							return '<span class="label label-success">ใช้งาน</span>';
						}
						else{
							return '<span class="label label-danger">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
			      if(inJSONArray("INS_BENEFITS_EDIT",session_app_permission_include) != -1){
							return '<a target="_blank" href="'+insBenefitsDetailUrl+'/'+full.ins_benefits_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="glyphicon glyphicon-wrench"></i></a>';
			      }
						return '<a target="_blank" href="'+insBenefitsDetailUrl+'/'+full.ins_benefits_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
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
			            if(inJSONArray("INS_BENEFITS_EDIT",session_app_permission_include) != -1){
				            if(full.isused=="T"){
				            	returnHtml+='<a href="#" onclick="disableInsBenefits(\''+full.ins_benefits_id+'\',$(\'#report-datatable\').DataTable()); return false;"><span>ไม่ใช้งาน</span></a>';
				            }
				            else{
				            	returnHtml+='<a href="#" onclick="enableInsBenefits(\''+full.ins_benefits_id+'\',$(\'#report-datatable\').DataTable()); return false;"><span>ใช้งาน</span></a>';
				            }
				            returnHtml+='<a href="#" onclick="deleteInsBenefits(\''+full.ins_benefits_id+'\',\''+full.ins_benefits_code+'\',$(\'#report-datatable\').DataTable()); return false;"><span>ลบ</span></a>';
				          }
									returnHtml+='<a href="'+insBenefitsViewUrl+'/'+full.ins_benefits_id+'" target="_blank"><span>View</span></a>';
									//returnHtml+='<a href="'+insBenefitsPrintUrl+'/'+full.ins_benefits_id+'" target="_blank"><span>Print</span></a>';
			            returnHtml+='</li>'
			            		+'</ul>'
			            	+'</div>';
			            return returnHtml;
					}
	      }
	        ],
	        "aaSorting": [[ 1, "desc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
        aoData = getFnServerParams(aoData,$("#form-search"));
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		$("#table-report-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	});
}
//end ins_benefits


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
	var elem=$(button).closest('div.form-group');
	$(elem).remove();
	$(".div-input-serial:last").addClass('last');
	if($("input[name='inputReceiptId[]']").size()==1){
		$(".btn-admin-remove-input-serial").addClass('hide');
	}
}
function couponInitCouponUseInputReceiptId(elem){
	elem.keypress(function(e){
		if(e.which!=13) return;

		var parentElem=$(elem).closest('div.form-group');
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

		var parentElem=$(elem).closest('div.form-group');
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
			//   		var parentElem=$(elem).closest('div.form-group');
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

		var parentElem=$(elem).closest('div.form-group');
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
			//   		var parentElem=$(elem).closest('div.form-group');
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
		bpkDataTable=$('#coupon-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
		bpkDataTable=$('#document-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
						returnHtml+='<a href="'+documentViewUrl+'/'+full.document_id+'" target="_blank" class="btn btn-primary margin-right3" rel="tooltip" data-title="Preview"><i class="glyphicon glyphicon-eye-open"></i></a>';
						if(full.view_only!='T'){
		        	returnHtml+='<a href="'+documentPrintUrl+'/'+full.document_id+'" target="_blank" class="btn btn-danger margin-right3" rel="tooltip" data-title="Print"><i class="glyphicon glyphicon-print"></i></a>'
        								+'<a href="'+documentDownloadUrl+'/'+full.document_id+'" target="_blank" class="btn btn-success margin-right3" rel="tooltip" data-title="Download"><i class="glyphicon glyphicon-download"></i></a>';
        		}
        		else{
		        	returnHtml+='<button class="btn btn-info margin-right3 disabled" rel="tooltip" data-title="Print"><i class="glyphicon glyphicon-print"></i></button>'
        								+'<button class="btn btn-info margin-right3 disabled" rel="tooltip" data-title="Download"><i class="glyphicon glyphicon-download"></i></button>';
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
		bpkDataTable=$('#document-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
						returnHtml+='<a href="'+documentViewUrl+'/'+full.document_id+'" target="_blank" class="btn btn-primary margin-right3" rel="tooltip" data-title="Preview"><i class="glyphicon glyphicon-eye-open"></i></a>';
						if(full.view_only!='T'){
		        	returnHtml+='<a href="'+documentPrintUrl+'/'+full.document_id+'" target="_blank" class="btn btn-danger margin-right3" rel="tooltip" data-title="Print"><i class="glyphicon glyphicon-print"></i></a>'
        								+'<a href="'+documentDownloadUrl+'/'+full.document_id+'" target="_blank" class="btn btn-success margin-right3" rel="tooltip" data-title="Download"><i class="glyphicon glyphicon-download"></i></a>';
        		}
        		else{
		        	returnHtml+='<button class="btn btn-info margin-right3 disabled" rel="tooltip" data-title="Print"><i class="glyphicon glyphicon-print"></i></button>'
        								+'<button class="btn btn-info margin-right3 disabled" rel="tooltip" data-title="Download"><i class="glyphicon glyphicon-download"></i></button>';
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

		$("#table-document-submit").click(function(){
			bpkDataTableSearchSubmit(bpkDataTable);
			return false;
		});
	});
}
//end document-ref


//contract-add
function validateContractAddForm(){
	var passValidate=true;

	$("input[name=inputContractCode]").val($.trim($("input[name=inputContractCode]").val()));
	$("input[name=inputContractName]").val($.trim($("input[name=inputContractName]").val()));

	//check input bottom up
	passValidate=checkInputTypeSelect($("select[id=inputSectionId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[id=inputHospitalId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[id=inputContractTypeId]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputContractName]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputContractCode]")) && passValidate;

	if(passValidate){
		$.ajax({
		  type: 'POST',
		  url: ajaxIsContractCodeExistUrl,
		  data: {"code":$("input[name=inputContractCode]").val()},
		  success: function(data) {
				if(data.exist){
					updateInputErrMsg($("input[name=inputContractCode]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputContractCode]"));
					passValidate=false;
				}
			},
		  dataType: "json",
		  async:false
		});
	}

	return passValidate;
}
if(viewName=="contract-add"){
	$("#inputHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,'T');
	});

	$(document).on("change","input[name^=inputOtherHospital]",function(){
		var inputSectionElem=$(this).closest('.choose-section').find("select.inputOtherSectionId");
		ajaxGetSectionFromHospital($(this),inputSectionElem,null,'T',function(){
		});
	});
	$(document).on("change","input[name^=inputOtherSectionId]",function(){
		contractAddOtherSection(this);
	});
}
//end contract-add

//contract-edit
function contractAddOtherSection(elem){
	var controlGroup=$(elem).closest('div.choose-section');
	if(controlGroup.hasClass('last')){
		var controlGroupClone=$(elem).closest('div.choose-section').clone();
		controlGroupClone.find('div.combobox-container').remove();
		controlGroupClone.find('.view-only').val("");
		controlGroupClone.find('.combobox').each(function(){
			$(this).attr('name',$(this).attr('attr-name'));
			$(this).show();
			if($(this).hasClass('inputOtherSectionId')){
				$('option' ,this).not('.first-option').remove();
			}
			$(this).combobox({highlighter: function(item){ return item; }});
		});
		controlGroup.after(controlGroupClone);
		controlGroup.removeClass('last');
		controlGroup.find('.btn.remove').removeClass('hide');
	}
}

function contractRemoveOtherSection(elem){
	var controlGroup=$(elem).closest('div.choose-section');
	controlGroup.remove();
}
function validateContractEditForm(){
	var passValidate=true;

	$("input[name=inputContractCode]").val($.trim($("input[name=inputContractCode]").val()));
	$("input[name=inputContractName]").val($.trim($("input[name=inputContractName]").val()));

	//check input bottom up
	passValidate=checkInputTypeSelect($("select[id=inputSectionId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[id=inputHospitalId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[id=inputContractTypeId]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputContractName]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputContractCode]")) && passValidate;

	if(passValidate && $("input[name=inputContractCode]").val()!=$("input[name=inputOldContractCode]").val()){
		$.ajax({
		  type: 'POST',
		  url: ajaxIsContractCodeExistUrl,
		  data: {"code":$("input[name=inputContractCode]").val()},
		  success: function(data) {
				if(data.exist){
					updateInputErrMsg($("input[name=inputContractCode]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputContractCode]"));
					passValidate=false;
				}
			},
		  dataType: "json",
		  async:false
		});
	}
	return passValidate;
}
if(viewName=="contract-edit"){
	$("#inputHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,'T');
	});

	$(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),$("#inputOldSectionId").val(),'T');		
	});

	$(document).on("change","input[name^=inputOtherHospital]",function(){
		var inputSectionElem=$(this).closest('.choose-section').find("select.inputOtherSectionId");
		ajaxGetSectionFromHospital($(this),inputSectionElem,null,'T',function(){
		});
	});
	$(document).on("change","input[name^=inputOtherSectionId]",function(){
		contractAddOtherSection(this);
	});

	$(function(){
		if(!canEditContract){
			readonly_form_elements($('#form-car-booking'));
			$("#form-car-booking #btn-save").hide();
			$("#form-contract .fileinput-new").closest('div.form-group').hide();
			$("#form-contract").on('submit',function(){
				return false;
			});
		}
	});
}
//end contract-edit

//contract
function enableContract(contract_id,dataTable){
	showPageLoading();
	$.post(contractEnableUrl, {"contract_id":contract_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ข้อมูลที่เลือกถูกเปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function disableContract(contract_id,dataTable){
	showPageLoading();
	$.post(contractDisableUrl, {"contract_id":contract_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ข้อมูลที่เลือกถูกปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function deleteContract(contract_id,contract_detail,dataTable){
	openModal("ยืนยันการลบ","ยืนยันการลบข้อมูล "+contract_detail+"?",true,function(){
		showPageLoading();
		$.post(contractDeleteUrl, {"contract_id":contract_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","ข้อมูลถูกลบเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
if(viewName=="contract-index"){
	$("#inputHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,'T');
	});
	$("#inputHospitalId").val(userHosId);
	// ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),userSectionId,'T');

	$(function(){
		bpkDataTable=$('#contract-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.code;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.contract_no;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.name;
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
				return full.partner;
				}
				},
	            { 	"mData" : null, "sClass": "right", "bVisible": fullViewContract,
					"mRender": function ( data, type, full ) {
						return parseFloat(full.capital).formatMoney(2,'.',',');
					}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.contract_type_detail;
				}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.incharge_emp_name;
				}
				},
				{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
				return full.contract_date;
				}
				},
				{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
				return full.create_date;
				}
				},
	     	{ "mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.status=='about_expire'){
							return '<span class="label label-warning">ใกล้หมดอายุ</span>';
						}
						else if(full.status=='expire'){
							return '<span class="label label-danger">หมดอายุ</span>';
						}
						else return 'ปกติ';
					}
				},
	     	{ "mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.isused=='T'){
							return '<span class="label label-success">ใช้งาน</span>';
						}
						else{
							return '<span class="label label-danger">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center", "bVisible": fullViewContract,
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+contractEditUrl+'/'+full.contract_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
					}
				},
	            {
	            	"mData" : null, "sClass": "center", "bVisible": canEditContract,
					"mRender": function ( data, type, full ) {
						var returnHtml= '<div class="btn-group">'
			            		+'<a class="btn-more btn btn-info dropdown-toggle" data-toggle="dropdown" href="#">'
			            		+'	More'
			            		+'	<span class="caret"></span>'
			            		+'</a>'
			            		+'<ul class="dropdown-menu">'
			            		+'	<li>';
			            if(full.isused=="T"){
			            	returnHtml+='<a href="#" onclick="disableContract(\''+full.contract_id+'\',$(\'#contract-datatable\').DataTable()); return false;"><span>ไม่ใช้งาน</span></a>';
			            }
			            else{
			            	returnHtml+='<a href="#" onclick="enableContract(\''+full.contract_id+'\',$(\'#contract-datatable\').DataTable()); return false;"><span>ใช้งาน</span></a>';
			            }
			            returnHtml+='<a href="#" onclick="deleteContract(\''+full.contract_id+'\',\''+full.code+'\',$(\'#contract-datatable\').DataTable()); return false;"><span>ลบ</span></a>';
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
	      aoData.push( { "name": "code", "value": $("#inputContractCode").val() } );
	      aoData.push( { "name": "name", "value": $("#inputContractName").val() } );
	      aoData.push( { "name": "contract_type_id", "value": $("#inputContractTypeId").val() } );
	      aoData.push( { "name": "hos_id", "value": $("#inputHospitalId").val() } );
	      aoData.push( { "name": "section_id", "value": $("#inputSectionId").val() } );
	      aoData.push( { "name": "contract_date_start", "value": $("#inputContractDateStart").val() } );
	      aoData.push( { "name": "contract_date_end", "value": $("#inputContractDateEnd").val() } );
	      aoData.push( { "name": "incharge_emp_name", "value": $("#inputInchargeEmpName").val() } );
	      aoData.push( { "name": "contract_no", "value": $("#inputContractNo").val() } );
	      aoData.push( { "name": "partner", "value": $("#inputPartner").val() } );
	      aoData.push( { "name": "status", "value": $("#inputStatus").val() } );
				aoData.push( { "name": "isused", "value": $("#inputIsused").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		$("#table-contract-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	});
}
//end contract


//car_license_plate-add
function validateCarLicensePlateAddForm(){
	var passValidate=true;

	$("input[name=inputCarLicensePlate]").val($.trim($("input[name=inputCarLicensePlate]").val()));

	//check input bottom up
	passValidate=checkInputTypeSelect($("select[id=inputSectionId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[id=inputHospitalId]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputCarLicensePlate]")) && passValidate;

	if(passValidate){
		$.ajax({
		  type: 'POST',
		  url: ajaxIsCarLicensePlateExistUrl,
		  data: {"license_plate":$("input[name=inputCarLicensePlate]").val()},
		  success: function(data) {
				if(data.exist){
					updateInputErrMsg($("input[name=inputCarLicensePlate]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputCarLicensePlate]"));
					passValidate=false;
				}
			},
		  dataType: "json",
		  async:false
		});
	}

	return passValidate;
}
if(viewName=="car_license_plate-add"){
	$("#inputHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,'T');
	});
}
//end car_license_plate-add

//car_license_plate-edit
function validateCarLicensePlateEditForm(){
	var passValidate=true;

	$("input[name=inputCarLicensePlate]").val($.trim($("input[name=inputCarLicensePlate]").val()));

	//check input bottom up
	passValidate=checkInputTypeSelect($("select[id=inputSectionId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[id=inputHospitalId]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputCarLicensePlate]")) && passValidate;

	if(passValidate && $("input[name=inputCarLicensePlate]").val()!=$("input[name=inputOldCarLicensePlate]").val()){
		$.ajax({
		  type: 'POST',
		  url: ajaxIsCarLicensePlateExistUrl,
		  data: {"license_plate":$("input[name=inputCarLicensePlate]").val()},
		  success: function(data) {
				if(data.exist){
					updateInputErrMsg($("input[name=inputCarLicensePlate]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputCarLicensePlate]"));
					passValidate=false;
				}
			},
		  dataType: "json",
		  async:false
		});
	}
	return passValidate;
}
if(viewName=="car_license_plate-edit"){
	$("#inputHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,'T');
	});

	$(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),$("#inputOldSectionId").val(),'T');		
	});

	$(function(){
		if(!canEditCarLicensePlate){
			readonly_form_elements($('#form-car_license_plate'));
			$("#form-car_license_plate #btn-save").hide();
			$("#form-car_license_plate .fileinput-new").closest('div.form-group').hide();
			$("#form-car_license_plate").on('submit',function(){
				return false;
			});
		}
	});
}
//end car_license_plate-edit

//car_license_plate
function enableCarLicensePlate(car_license_plate_id,dataTable){
	showPageLoading();
	$.post(carLicensePlateEnableUrl, {"car_license_plate_id":car_license_plate_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ข้อมูลที่เลือกถูกเปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function disableCarLicensePlate(car_license_plate_id,dataTable){
	showPageLoading();
	$.post(carLicensePlateDisableUrl, {"car_license_plate_id":car_license_plate_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ข้อมูลที่เลือกถูกปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function deleteCarLicensePlate(car_license_plate_id,car_license_plate,dataTable){
	openModal("ยืนยันการลบ","ยืนยันการลบข้อมูล "+car_license_plate+"?",true,function(){
		showPageLoading();
		$.post(carLicensePlateDeleteUrl, {"car_license_plate_id":car_license_plate_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","ข้อมูลถูกลบเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
if(viewName=="car_license_plate-index"){
	$("#inputHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,'T');
	});
	$("#inputHospitalId").val(userHosId);
	// ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),userSectionId,'T');

	$(function(){
		bpkDataTable=$('#car_license_plate-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.license_plate;
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
					return full.driver_emp_name;
				}
				},
				{ 	"mData" : null, "sClass": "left",
				"mRender": function ( data, type, full ) {
				return full.note;
				}
				},
				{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
				return full.create_date;
				}
				},
				{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
				return full.update_date;
				}
				},
	     	{ "mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.isused=='T'){
							return '<span class="label label-success">ใช้งาน</span>';
						}
						else{
							return '<span class="label label-danger">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center", "bVisible": canEditCarLicensePlate,
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+carLicensePlateEditUrl+'/'+full.car_license_plate_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
					}
				},
	            {
	            	"mData" : null, "sClass": "center", "bVisible": canEditCarLicensePlate,
					"mRender": function ( data, type, full ) {
						var returnHtml= '<div class="btn-group">'
			            		+'<a class="btn-more btn btn-info dropdown-toggle" data-toggle="dropdown" href="#">'
			            		+'	More'
			            		+'	<span class="caret"></span>'
			            		+'</a>'
			            		+'<ul class="dropdown-menu">'
			            		+'	<li>';
			            if(full.isused=="T"){
			            	returnHtml+='<a href="#" onclick="disableCarLicensePlate(\''+full.car_license_plate_id+'\',$(\'#car_license_plate-datatable\').DataTable()); return false;"><span>ไม่ใช้งาน</span></a>';
			            }
			            else{
			            	returnHtml+='<a href="#" onclick="enableCarLicensePlate(\''+full.car_license_plate_id+'\',$(\'#car_license_plate-datatable\').DataTable()); return false;"><span>ใช้งาน</span></a>';
			            }
			            returnHtml+='<a href="#" onclick="deleteCarLicensePlate(\''+full.car_license_plate_id+'\',\''+full.car_license_plate+'\',$(\'#car_license_plate-datatable\').DataTable()); return false;"><span>ลบ</span></a>';
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
      	aoData = getFnServerParams(aoData,$("#form-search"));
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		$("#table-car_license_plate-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	});
}
//end car_license_plate


//check_vaccine-index
function validateCheckVaccineForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputPid]")) && passValidate;

	return passValidate;
}
if(viewName=="check_vaccine-index"){
}
//end check_vaccine-index


//survey-add
function validateSurveyAddForm(){
	var passValidate=true;

	var url_text=$.trim($("input[name=inputUrl]").val());
	url_text = url_text.replace(/"/g, "").replace(/'/g, "").replace(/\+/g, "").replace(/\(|\)/g, "").replace(/\[|\]/g, "");
	$("input[name=inputUrl]").val(url_text);

	$("input[name=inputSurveyName]").val($.trim($("input[name=inputSurveyName]").val()));

	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputSurveyName]")) && passValidate;

	if(passValidate){
		$.ajax({
		  type: 'POST',
		  url: ajaxIsSurveyUrlExistUrl,
		  data: {"url":$("input[name=inputUrl]").val()},
		  success: function(data) {
				if(data.exist){
					updateInputErrMsg($("input[name=inputUrl]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputUrl]"));
					passValidate=false;
				}
			},
		  dataType: "json",
		  async:false
		});
	}

	return passValidate;
}
if(viewName=="survey-add"){
}
//end survey-add

//survey-edit
function saveSurveyCreator(){
	var json = surveyCreator.text;

	$.ajax({
	  type: 'POST',
	  url: surveyCreatorSaveUrl,
	  data: {'survey_id': surveyId,  'json': json},
	  beforeSend: showPageLoading,
	  complete: hidePageLoading,
	  success: function(data) {
	  	if(data.error!=''){
				openModal("fail",data.error,false,null);
			}
			else{
     		openModal("success","Save Complete",false,null);
			}
		},
	  dataType: "json",
	  async:true
	});	
}
function initSurveyLocale(){
	Survey.surveyLocalization.defaultLocale='th';
	Survey.surveyLocalization.locales["th"] = {};  
	Survey.surveyLocalization.localeNames["th"] = "ไทย";  

	Survey.surveyLocalization.localeNames["zh-cn"] = "Chinese";  
	Survey.surveyLocalization.localeNames["ar"] = "Arab";  
	Survey.surveyLocalization.localeNames["en"] = "English";  
	Survey.surveyLocalization.localeNames["my"] = "Myanmar(Burmese)";  

	Survey.surveyLocalization.supportedLocales = ["th","en","zh-cn","ar","my"];
}
function signaturePadResizeCanvas(canvas) {
  var context = canvas.getContext("2d");
  var devicePixelRatio = window.devicePixelRatio || 1;
  var backingStoreRatio =
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1;

  var ratio = devicePixelRatio / backingStoreRatio;

  var oldWidth = canvas.width;
  var oldHeight = canvas.height;

  canvas.width = oldWidth * ratio;
  canvas.height = oldHeight * ratio;

  canvas.style.width = oldWidth + "px";
  canvas.style.height = oldHeight + "px";

  context.scale(ratio, ratio);
}
function surveyAddSignaturePad(){
	var defaultWidth = 400;
	var defaultHeight = 200;
	var widget = {
    name: "signaturepad",
    title: "Signature pad",
    iconName: "icon-signaturepad",
    widgetIsLoaded: function () {
      return true;
  	},
    penColor: "#000",
    isFit: function(question) {
      return question.getType() === "signaturepad";
    },
    htmlTemplate:
      "<div class='sjs_sp_container'><div><canvas tabindex='0' style='border: 1px solid #ccc; border-radius: 5px;'></canvas></div><div class='sjs_sp_controls'><button type='button' class='sjs_sp_clear btn btn-danger' title='Clear'>Clear Signature</button></div></div><style>.sjs_sp_container { position: relative; } .sjs_sp_controls { } .sjs_sp_controls > button { user-select: none; } .sjs_sp_container>div>canvas:focus { outline: none; }</style>",
    activatedByChanged: function(activatedBy) {
      Survey.JsonObject.metaData.addClass("signaturepad", [], null, "empty");
      Survey.JsonObject.metaData.addProperties("signaturepad", [
        {
          name: "allowClear:boolean",
          default: true
        },
        {
          name: "width:number",
          default: defaultWidth
        },
        {
          name: "height:number",
          default: defaultHeight
        }
      ]);
    },
    afterRender: function(question, el) {
      var rootWidget = this;
      var canvas = el.getElementsByTagName("canvas")[0];
      var buttonEl = el.getElementsByTagName("button")[0];
      var signaturePad = new SignaturePad(canvas);
      if (question.isReadOnly) {
        signaturePad.off();
      }

      buttonEl.onclick = function() {
        question.value = undefined;
      };

      question.readOnlyChangedCallback = function() {
        if (!question.allowClear || question.isReadOnly) {
          signaturePad.off();
          buttonEl.style.display = "none";
        } else {
          signaturePad.on();
          buttonEl.style.display = "block";
        }
      };

      signaturePad.penColor = rootWidget.penColor;
      signaturePad.onBegin = function() {
        canvas.focus();
      };
      signaturePad.onEnd = function() {
        var data = signaturePad.toDataURL();
        question.value = data;
      };
      var updateValueHandler = function() {
        var data = question.value;

        var width = question.width || defaultWidth;
			  // var parentWidth = $(canvas).closest('div').width();
			  // if(width>parentWidth) width = parentWidth;
        canvas.width = width;

        canvas.height = question.height || defaultHeight;
        signaturePadResizeCanvas(canvas);
        signaturePad.fromDataURL(
          data || "data:image/gif;base64,R0lGODlhAQABAIAAAP"
        );
      };
      question.valueChangedCallback = updateValueHandler;
      updateValueHandler();
      question.readOnlyChangedCallback();
      question.signaturePad = signaturePad;
      var propertyChangedHandler = function(sender, options) {
        if (options.name === "width" || options.name === "height") {
          updateValueHandler();
        }
      };
      question.onPropertyChanged.add(propertyChangedHandler);
      question.signaturePad.propertyChangedHandler = propertyChangedHandler;
    },
    willUnmount: function(question, el) {
      if (question.signaturePad) {
        question.onPropertyChanged.remove(
          question.signaturePad.propertyChangedHandler
        );
        question.signaturePad.off();
      }
      question.readOnlyChangedCallback = null;
      question.signaturePad = null;
      question.readOnlyChangedCallback = null;
    },
    pdfRender: function(surveyPDF, options) {
      if (options.question.getType() === "signaturepad") {
        var point = options.module.SurveyHelper.createPoint(
          options.module.SurveyHelper.mergeRects.apply(null, options.bricks)
        );
        point.xLeft += options.controller.unitWidth;
        point.yTop +=
          options.controller.unitHeight *
          options.module.FlatQuestion.CONTENT_GAP_VERT_SCALE;
        var imageBrick = options.module.SurveyHelper.createImageFlat(
          point,
          options.question,
          options.controller,
          surveyPDF.data[options.question.name],
          parseInt(options.question.width)
        );
        options.bricks.push(imageBrick);
      }
    }
  };

	Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");
}
function initSurveyCreator(){
	var options = {
		showEmbededSurveyTab : false,
		showTestSurveyTab : true,
		showJSONEditorTab : false,
		showOptions: false,
		showTranslationTab: true
	};

	initSurveyLocale();

	SurveyCreator.StylesManager.applyTheme("bootstrap");
	surveyCreator = new SurveyCreator.SurveyCreator("surveyCreatorContainer", options);
	//set function on save callback
	surveyCreator.saveSurveyFunc = saveSurveyCreator;
	surveyCreator.text = surveyCreatorJson || "";
}
function validateSurveyEditForm(){
	var passValidate=true;

	var url_text=$.trim($("input[name=inputUrl]").val());
	url_text = url_text.replace(/"/g, "").replace(/'/g, "").replace(/\+/g, "").replace(/\(|\)/g, "").replace(/\[|\]/g, "");
	$("input[name=inputUrl]").val(url_text);

	$("input[name=inputSurveyName]").val($.trim($("input[name=inputSurveyName]").val()));

	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputSurveyName]")) && passValidate;

	if(passValidate && $("input[name=inputUrl]").val()!=$("input[name=inputOldUrl]").val()){
		$.ajax({
		  type: 'POST',
		  url: ajaxIsSurveyUrlExistUrl,
		  data: {"url":$("input[name=inputUrl]").val()},
		  success: function(data) {
				if(data.exist){
					updateInputErrMsg($("input[name=inputUrl]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputUrl]"));
					passValidate=false;
				}
			},
		  dataType: "json",
		  async:false
		});
	}
	return passValidate;
}
if(viewName=="survey-edit"){
	initSurveyCreator();
	$(function(){
	});
}
//end survey-edit

//survey
function enableSurvey(survey_id,dataTable){
	showPageLoading();
	$.post(surveyEnableUrl, {"survey_id":survey_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ข้อมูลที่เลือกถูกเปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function disableSurvey(survey_id,dataTable){
	showPageLoading();
	$.post(surveyDisableUrl, {"survey_id":survey_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ข้อมูลที่เลือกถูกปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function deleteSurvey(survey_id,survey,dataTable){
	openModal("ยืนยันการลบ","ยืนยันการลบข้อมูล "+survey+"?",true,function(){
		showPageLoading();
		$.post(surveyDeleteUrl, {"survey_id":survey_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","ข้อมูลถูกลบเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
function viewSurvey(survey_id,url){
	if(url!=null && url!=''){
		window.open(surveyViewUrl+'/'+url);
	}
	else{
		window.open(surveyViewUrl+'?survey_id='+survey_id);
	}
}
if(viewName=="survey-index"){
	$(function(){
		bpkDataTable=$('#survey-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.survey_name;
					}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.hos_detail;
				}
				},				
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.detail;
				}
				},				
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.url;
				}
				},
				{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
				return full.create_date;
				}
				},		
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.create_by_emp_name;
				}
				},
				{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
				return full.update_date;
				}
				},
	     	{ "mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.isused=='T'){
							return '<span class="label label-success">ใช้งาน</span>';
						}
						else{
							return '<span class="label label-danger">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center", "bVisible": canEditSurvey,
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+surveyEditUrl+'/'+full.survey_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
					}
				},
	            {
	            	"mData" : null, "sClass": "center", "bVisible": canEditSurvey,
					"mRender": function ( data, type, full ) {
						var returnHtml= '<div class="btn-group">'
			            		+'<a class="btn-more btn btn-info dropdown-toggle" data-toggle="dropdown" href="#">'
			            		+'	More'
			            		+'	<span class="caret"></span>'
			            		+'</a>'
			            		+'<ul class="dropdown-menu">'
			            		+'	<li>';
			            if(full.isused=="T"){
			            	returnHtml+='<a href="#" onclick="disableSurvey(\''+full.survey_id+'\',$(\'#survey-datatable\').DataTable()); return false;"><span>ไม่ใช้งาน</span></a>';
			            }
			            else{
			            	returnHtml+='<a href="#" onclick="enableSurvey(\''+full.survey_id+'\',$(\'#survey-datatable\').DataTable()); return false;"><span>ใช้งาน</span></a>';
			            }
			            returnHtml+='<a href="#" onclick="deleteSurvey(\''+full.survey_id+'\',\''+full.survey+'\',$(\'#survey-datatable\').DataTable()); return false;"><span>ลบ</span></a>';
			            returnHtml+='<a href="#" onclick="viewSurvey(\''+full.survey_id+'\',\''+full.url+'\'); return false;"><span>View Survey</span></a>';
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
      	aoData = getFnServerParams(aoData,$("#form-search"));
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		$("#table-survey-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	});
}
//end survey


//survey_view
function initSurveyPrint(){
	window.survey = new Survey.Model(surveyJson);
	survey.data = surveyResultJson;

	var surveyForm = $("#surveyElement");

	surveyForm.css('padding','10px');

	surveyForm.append('<b class="print-survey-title">'+survey.title+'</b>');

	var i = 0;

	survey.getAllQuestions().map(function(q) {
  	var sTitle = (q.title || "").trim(" ") || q.name;
  	var sTitleShort = sTitle;
  	if(sTitleShort.length>40) sTitleShort = sTitleShort.substring(0,40)+'...';

  	if(surveyResultJson.hasOwnProperty(q.name)){
  		var value = surveyResultJson[q.name];
  		surveyForm.append('<b class="print-question">'+(i+1)+'. '+sTitle+'</b>');
  		i++;

  		var showingAnswer = '';

    	var fieldType = q.getType();
    	if(fieldType=='file'){
    		var jsonData = q.displayValue;
    		if(!jsonData || jsonData.length==0) return '';
  			surveyForm.append('<img src="'+jsonData[0].content+'" class="print-img" style="max-width:100%; max-height:300px;" />');
    	}
    	else{
	      var displayValue = q.displayValue;
	      showingAnswer = (
	        (typeof displayValue === "string"
	          ? displayValue
	          : JSON.stringify(displayValue)) || ""
	      );
  			surveyForm.append('<b class="print-answer">'+showingAnswer+'</b>');
	    }

  	}
  });
}
var surveyPlace = '';
function initSurveyView(){
	// Survey.surveyLocalization.defaultLocale='th';
	surveyAddSignaturePad();
	initSurveyLocale();
	Survey
    .StylesManager
    .applyTheme("bootstrap");
  Survey.defaultBootstrapCss.navigationButton = "btn btn-primary";
	
	Survey
    .Serializer
    .addProperty("question", "fileVideo:text");
	Survey
    .Serializer
    .addProperty("question", "fileAudio:text");

	window.survey = new Survey.Model(surveyJson);
	
	survey
    .onAfterRenderQuestion
    .add(function (survey, options) {
    		//form vital sign Hospitel BPK9
    		if (surveyId=='52'){
      		$("div[name='Name-lastname'] input[type=text]").prop('readonly',true);
      		$("div[name='Room'] input[type=text]").prop('readonly',true);
      		$("div[name='Temp'] input[type=text]").addClass('pos-decimal');

    			if (options.question.name === "pid"){    				
	    			var fieldName = options.question.name;
	        	$("div[name="+fieldName+"] input[type=text]").addClass('pos-integer');
	        	$("div[name="+fieldName+"] input[type=text]").prop('maxlength','13');
	        	$("div[name="+fieldName+"] input[type=text]").keyup(function(){
	        		var pid = $(this).val();
	        		$("div[name='Name-lastname'] input[type=text]").val('ไม่พบข้อมูล');
	        		$("div[name='Name-lastname'] input[type=text]").trigger('change');
	        		$("div[name='Room'] input[type=text]").val('ไม่พบข้อมูล');
	        		$("div[name='Room'] input[type=text]").trigger('change');
	        		$("div[name='Temp'] input[type=text]").val('');
	        		$("div[name='Temp'] input[type=text]").trigger('change');
	        		$("div[name='Temp'] input[type=text]").prop('readonly',true);
	        		if(pid.length<13) return;
							$.ajax({
							  type: 'GET',
							  beforeSend: showPageLoading,
							  complete: hidePageLoading,
							  url: bpkConnectHttpsApiBaseUrl+'/patient/get_patient_bed',
							  data: {'token':'asdf1234aaa', 'pid': pid, 'hos_code':'900'},
							  success: function(data) {
							  	console.log(data);
							  	if(data.error==''){
							  		var patients = data.patients;
							  		if(patients.length>0){
							  			var patient = patients[0];
					        		$("div[name='Name-lastname'] input[type=text]").val(patient.firstname+' '+patient.lastname).trigger('change');
							  			if(patient.bed_management!=null){
					        			$("div[name='Room'] input[type=text]").val(patient.bed_management.room_number).trigger('change');
							  			}
							  			$("div[name='Temp'] input[type=text]").prop('readonly',false);
							  		}
							  	}
								},
							  dataType: "json",
							  async:true
							});	
	        	});
					}
    		}
        if (options.question.inputType === "date" && options.question.isEmpty() && !options.question.isReadOnly) {
         	options.question.value = new Date().toISOString().substring(0, 10);
        }
        if ((surveyId=='56' && options.question.name === "question1" && !options.question.isReadOnly) 
        	|| (surveyId=='53' && options.question.name === "Covid_OutArea" && !options.question.isReadOnly))
        {
	  			var fieldName = '';
	  			if(surveyId=='56'){
	  				fieldName = 'question1';
	  			}
	  			else if(surveyId=='53'){
	  				fieldName = 'Covid_OutArea_';
	  			}

        	$("input[name^="+fieldName+"]").click(function(){
        		if($("input[name^="+fieldName+"]:checked").size()>0){
							surveyPlace = $("input[name^="+fieldName+"]:checked").attr('aria-label');
        		}
        		else{
        			surveyPlace = '';
        		}

        		var appt_location = $("input[name^="+fieldName+"]:checked").val();

						$.ajax({
						  type: 'GET',
						  beforeSend: showPageLoading,
						  complete: hidePageLoading,
						  url: apiSurveyGetApptCountByLocationUrl,
						  data: {'survey_id': surveyId,  'appt_location': appt_location},
						  success: function(data) {
						  	enabledDateList = data.enabled_date_list;
						  	$(".input_appt_date").data("DateTimePicker").enabledDates(enabledDateList);
						  	$(".input_appt_date").data("DateTimePicker").clear();
							},
						  dataType: "json",
						  async:true
						});	
        	});
        }

        if (!isNullOrEmpty(surveyData.appt_date_field) && options.question.name == surveyData.appt_date_field && !options.question.isReadOnly) {        	
        	var inputId = options.question.inputId;
        	var elem = $("#"+inputId);
        	$(elem).closest('div').css('position','absolute');
        	$(elem).closest('div.sv_qstn').css('margin-bottom','10px');
        	$(elem).addClass('input_appt_date');
        	$(elem).prop('type','text');
        	$(elem).prop('autocomplete','off');
        	$(elem).prop('readonly',true);
        	$(elem).css('background-color','#fff');
        	if(surveyData.appt_date_format=='date'){
        		$(elem).attr('format','YYYY-MM-DD');
        	}
					$(elem).each(function(){
						// $(this).on('keydown paste', function (e) {
					 //    e.preventDefault();
					 //    return false;
						// });
						$(this).datetimepicker({
							useCurrent: false,
							ignoreReadonly: true,
					    format: !$(this).attr('format')?"YYYY-MM-DD HH:mm":$(this).attr('format'),
					    showTodayButton: true,
					    showClear: true,
					    showClose: true,
					    toolbarPlacement: 'top',
					    enabledDates: enabledDateList,
					    // minDate: apptMinDate,
					    // maxDate: apptMaxDate
						}).on('dp.change', function(e) {
							$(this).change();
							if($(this).val().length>=10){
								var dateText = $(this).val().substring(0,10);
								if($.inArray(dateText,enabledDateList)==-1){
									// alert("Date "+dateText+" is not available!");
									$(this).val('');
									$(this).change();
								}
							}
						});
						 
						$(this).data("DateTimePicker").clear();
					});
        }
    });
	
	survey
    .onAfterRenderQuestion
    .add(function (survey, options) {
        //Return if there is no description to show in popup
        if (!options.question.fileVideo) 
            return;

        var header = options
            .htmlElement
            .querySelector("h5");
        var html = '<video controls style="max-height:240px; margin:5px 0;">';
        html+='<source src="'+options.question.fileVideo+'" type="video/mp4">';
        html+='Your browser does not support the video tag.';
        html+='</video>';
        $(header).after(html);
        $(header).after('<div class="clearfix"></div>');
    });
	
	survey
    .onAfterRenderQuestion
    .add(function (survey, options) {
        //Return if there is no description to show in popup
        if (!options.question.fileAudio) 
            return;

        var header = options
            .htmlElement
            .querySelector("h5");
        var html = '<audio controls style="margin:5px 0;">';
        html+='<source src="'+options.question.fileAudio+'" type="audio/mpeg">';
        html+='Your browser does not support the audio element.';
        html+='</audio>';
        $(header).after(html);
        $(header).after('<div class="clearfix"></div>');
    });

	if(consentFormFileName!=''){
	  survey.onAfterRenderSurvey.add(function(survey,options){
	  	var html = '';
	  	html+='<div class="form-group col-md-6" style="margin:15px 0; display:none;" id="div-consent-form">'
          +'<b style="font-size:14px;">ประกาศนโยบายความเป็นส่วนตัว</b>'
          +'<div class="clearfix"></div>'
          +'<label class="checkbox-inline">'
            +'<input type="checkbox" name="contact_privacy_accept1" value="contact_privacy_accept_text1">*ฉันยอมรับนโยบายความเป็นส่วนตัว'
          +'</label>'
          +'<a class="checkbox-inline" href="'+base_url+'consent_form/'+consentFormFileName+'" target="_blank" style="text-decoration:underline; color:#000; padding-left:1px;">อ่านข้อมูลเพิ่มเติม</a>'
          +'<div class="clearfix"></div>'
          +'<label class="checkbox-inline">'
            +'<input type="checkbox" name="contact_privacy_accept2" value="contact_privacy_accept_text2">ยินดีให้ใช้ในการส่งข้อมูลข่าวสาร'
          +'</label>'
          +'<div class="clearfix"></div>'
          +'<span class="help-inline" style="color:red;"></span>'
        +'</div>';
       html+='<div class="clearfix"></div>';

	  	$('#surveyElement .panel-footer').before(html);
	  	
	  	if(survey.isLastPage){
	  		$("#div-consent-form").show();
	  	}
	  	else{
	  		$("#div-consent-form").hide();
	  	}
	  });

	  survey.onAfterRenderPage.add(function(survey,options){
	  	if(survey.isLastPage){
	  		$("#div-consent-form").show();
	  	}
	  	else{
	  		$("#div-consent-form").hide();
	  	}
	  });
	}

  survey.onCompleting
    .add(function (result,options) {
  		console.log('onCompleting');
  		consentFormData = null;
			if(consentFormFileName!=''){
				if(!$("input[name=contact_privacy_accept1]").is(":checked")){
					checkInputTypeCheckbox($("input[name=contact_privacy_accept1]"),true);
			  	options.allowComplete = false;
				}

				consentFormData = {};
      	consentFormData.contact_privacy_accept1 = $("input[name=contact_privacy_accept1]").is(":checked")?'T':'F';
      	consentFormData.contact_privacy_accept2 = $("input[name=contact_privacy_accept2]").is(":checked")?'T':'F';
      	console.log(consentFormData);	      
			}

  		if(surveyId=='52'){
	    	if($("div[name='Room'] input[type=text]").val()=='ไม่พบข้อมูล'){
					alert("ไม่พบข้อมูลตามเลขบัตรประชาชน");
			  	options.allowComplete = false;
	    		$("div[name='pid'] input[type=text]").focus();
	    	}
  		}
  		if(surveyId=='53' || surveyId=='56'){
  			var fieldName = '';

  			if(surveyId=='56'){
  				fieldName = 'question1';
  			}
  			else if(surveyId=='53'){
  				fieldName = 'Covid_OutArea_';
  			}

    		var appt_location = $("input[name^="+fieldName+"]:checked").val();

				$.ajax({
				  type: 'GET',
				  beforeSend: showPageLoading,
				  complete: hidePageLoading,
				  url: apiSurveyGetApptCountByLocationUrl,
				  data: {'survey_id': surveyId,  'appt_location': appt_location},
				  success: function(data) {
				  	enabledDateList = data.enabled_date_list;
				  	console.log($(".input_appt_date").val());
				  	if(enabledDateList.indexOf($(".input_appt_date").val())==-1){
							alert("วันที่เลือกเต็มแล้ว กรุณาระบุวันที่ใหม่");
					  	options.allowComplete = false;
					  	$(".input_appt_date").data("DateTimePicker").enabledDates(enabledDateList);
					  	$(".input_appt_date").data("DateTimePicker").clear();
					  	$(".input_appt_date").focus();
				  	}
				  	else{
					  	options.allowComplete = true;
				  	}
					},
				  dataType: "json",
				  async:false
				});	
  		}
  	});

	survey
    .onComplete
    .add(function (result,options) {
  		console.log('onComplete');
      // document
      //   .querySelector('#surveyResult')
      //   .textContent = "Result JSON:\n" + JSON.stringify(result.data, null, 3);
      var consentForm = '';
      if(consentFormData!=null){
      	consentForm = JSON.stringify(consentFormData);
      	console.log(consentForm);
      }

      $.ajax({
			  type: 'POST',
			  url: apiSurveyResultSaveUrl,
			  data: {'survey_id': surveyId,  'json': JSON.stringify(result.data),  'consent_form': consentForm},
			  beforeSend: showPageLoading,
			  complete: hidePageLoading,
			  success: function(data) {
			  	if(data.error!=''){
						openModal("fail",data.error,false,null);
					}
					else{						
						if(data.queue_no!=''){
							if(surveyId=='53'){
								$("#surveyElement").append('<b style="padding:10px; display:block; font-size:20px;">'+data.patient_name+'</b>');
								$("#surveyElement").append('<b style="padding:10px; display:block; font-size:20px;">'+surveyPlace+'</b>');
							}
							else if(surveyId=='56'){
								$("#surveyElement").append('<b style="padding:10px; display:block; font-size:20px;">'+data.patient_name+'</b>');
								$("#surveyElement").append('<b style="padding:10px; display:block; font-size:20px;">'+surveyPlace+'</b>');
							}
							else if(surveyId=='68'){
								$("#surveyElement").append('<b style="padding:10px; display:block; font-size:20px;">คิวที่(Queue No): '+data.queue_no+' &nbsp;&nbsp;'+data.queue_detail+'</b>');
								$("#surveyElement").append('<b style="padding:10px; display:block; font-size:20px;">'+data.patient_name+'</b>');
							}
							else{
								$("#surveyElement").append('<b style="padding:10px; display:block; font-size:20px;">คิวที่(Queue No): '+data.queue_no+' &nbsp;&nbsp;'+data.queue_detail+'</b>');
							}

							$("#surveyElement").append('<b style="padding:10px; display:block;">วันที่ทำรายการ: '+data.create_date+'</b>');
							$("#surveyElement").append('<b style="padding:10px; display:block;">วันที่ต้องการ: '+data.appt_date+'</b>');
						}
						else if(surveyId=='55'){
							$("#surveyElement").append('<b style="padding:10px; display:block; font-size:20px;">'+data.patient_name+'</b>');
						}
						else if(data.queue_detail!=''){
							$("#surveyElement").append('<b style="padding:10px; display:block; font-size:20px;">'+data.queue_detail+'</b>');
						}

						if(data.pic!=''){
							$("#surveyElement").append('<br/><img src="'+data.pic+'" />');
						}

						if(data.complete_text!=''){
							$("#surveyElement").append('<b style="padding:10px; display:block; font-size:20px;">'+nl2br(data.complete_text)+'</b>');
						}
					}
					// else{
		   //   		openModal("success","Save Complete",false,null);
					// }
				},
			  dataType: "json",
			  async:true
			});	
    });

  survey.onUploadFiles.add((survey, options) => {
  	console.log('onUploadFiles');
    var formData = new FormData();
    options.files.forEach(function(file) {
        formData.append(file.name, file);
    });
    showPageLoading();
    $.ajax({
        url: apiSurveyUploadFileUrl,
        type: "POST",
        xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                myXhr.upload.addEventListener('progress', function (event) {
                    var percent = 0;
                    var position = event.loaded || event.position;
                    var total = event.total;
                }, false);
            }
            return myXhr;
        },
        success: function (data) {
        	hidePageLoading();
					if(data.error!=''){
						openModal("fail",data.error,false,null);
					}
					else{
            options.callback("success",
                options.files.map(file => {
                    return { file: file, content: data.url };
                })
            );
	        }
        },
        error: function (error) {
        	hidePageLoading();
					openModal("fail",error,false,null);
        },
        async: true,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        timeout: 60000,
        dataType: "json"
    });
	});

  survey.locale = surveyLang;
	survey.render("surveyElement");

	survey.onValueChanged.add(function(survey, options) {
	  if(!options.question) return;
	  if(options.name=='language'){
		  survey.locale = options.value;
			survey.render();
	  }
    if (!isNullOrEmpty(surveyData.appt_date_field) && options.question.name == surveyData.appt_date_field && !options.question.isReadOnly) {        	
	  	var inputId = options.question.inputId;
      var elem = $("#"+inputId);
      setTimeout(function(){
	      if(options.value!=elem.val()){
	      	elem.val('');
	      	elem.change();
	      }
      },100);
	  }
	});

	if(surveyResultId!=''){
		survey.mode = 'display';
		survey.data = surveyResultJson;
	  survey.locale = surveyResultJson.language;
	  survey.isSinglePage = true;
		survey.render();
	}
}
function surveyViewPrint(){
	window.print();
}
if(viewName=="survey_view-index"){
	if(isPrint=='T'){
		initSurveyPrint();
	}
	else{
		initSurveyView();
	}
}
//end survey_view


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
if(viewName=="news-index"){
	$(document).ready(function() {
		bpkDataTable=$('#news-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
			            if(full.create_by==userEmpId || inJSONArray("NEWS_SECTION_ADMIN",session_app_permission_include) != -1){
			            	returnHtml+='<li><a target="_blank" href="'+newsEditUrl+'/'+full.news_id+'"><span>แก้ไข</span></a></li>'
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

		$("#table-news-submit").click(function(){
			bpkDataTableSearchSubmit(bpkDataTable);
			return false;
		});
	});
}
//end news-index

//news-view
function newsToggleFullscreen(){
	if(!isFullScreen){
		// $("#container").children().hide();
		// $("#show-fullscreen").html('');
		// $("#show-fullscreen").show();
		// $("#show-fullscreen").append($("#div-news-content").clone());
		// $("#show-fullscreen").append('<div class="clearboth style="padding:10px;"></div>');
		$("#button-toogle-fullscreen").val('Cancel Full Screen');

		$("#div-news-content").removeClass('col-md-11').addClass('col-md-12').addClass('content-full-screen');
		var parentElem=$("#div-news-content").closest('.form-group').closest('.col-md-12');
		parentElem.addClass('div-full-screen');
		$("#div-news-content-label").hide();
		$("form#news-view > div").not('.div-full-screen').hide();
		document.body.scrollTop = document.documentElement.scrollTop = 0;
		isFullScreen=true;
	}
	else{
		// $("#container").children().show();
		// $("#show-fullscreen").html('');
		// $("#show-fullscreen").hide();
		$("#button-toogle-fullscreen").val('Full Screen');

		$("#div-news-content").removeClass('col-md-12').addClass('col-md-11').removeClass('content-full-screen');
		var parentElem=$("#div-news-content").closest('.form-group').closest('.col-md-12');
		parentElem.removeClass('div-full-screen');
		$("form#news-view > div").show();
		$("#div-news-content-label").show();
		isFullScreen=false;
	}
}
if(viewName=="news-view"){
}

//home-index
var bpkDataTable_News;
var bpkDataTableProjectTrack;
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
			bpkDataTableSearchSubmit(bpkDataTableProjectTrack);
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
function getDatatableDataForPoApprove(){
	$('#waiting-approve-po-datatable').dataTable().fnClearTable();
	poWatingApproveDataList=new Array();
	onDTCheckboxChangeFunctionPoWaitingApprove();

	var inputShowBelowLevel = '';
	if($("#inputShowBelowLevel").is(':checked')){
		inputShowBelowLevel='T';
	}
	else{
		inputShowBelowLevel='F';
	}

	var inputPoWaitApproveIsTrade = $("#inputPoWaitApproveIsTrade").val();

	$.ajax({
	  type: 'POST',
	  url: purchaseApiBaseUrl+'/po/waiting_approve',
	  data: {'emp_id': userEmpId,  'branchcode': $("#inputPoWaitApproveHospitalId").val(), 'is_showBelowLevel': inputShowBelowLevel, 'is_trade': inputPoWaitApproveIsTrade},
	  beforeSend: null,
	  success: function(data) {
	  	$('#waiting-approve-po-datatable').dataTable().fnClearTable();
	  	if(data.aaData.length>0){
				$('#waiting-approve-po-datatable').dataTable().fnAddData(data.aaData);
				var tmpDataList=data.aaData;
				for(var i in tmpDataList){
					poWatingApproveDataList[tmpDataList[i].po_id]=tmpDataList[i];
				}
				onDTCheckboxChangeFunctionPoWaitingApprove();
			}
		},
	  dataType: "json",
	  async:true,
	  complete: null
	});	
}
function getDatatableDataForPoReview(){
	$('#waiting-review-po-datatable').dataTable().fnClearTable();
	poWaitingReviewDataList=new Array();
	onDTCheckboxChangeFunctionPoWaitingReview();

	var inputShowBelowLevelReviewPo = '';
	if($("#inputShowBelowLevelReviewPo").is(':checked')){
		inputShowBelowLevelReviewPo='T';
	}
	else{
		inputShowBelowLevelReviewPo='F';
	}

	var inputPoWaitReviewIsTrade = $("#inputPoWaitReviewIsTrade").val();

	if(empHosCode!=""){
		$.ajax({
		  type: 'POST',
		  url: purchaseApiBaseUrl+'/po/waiting_review',
		  data: {'emp_id': userEmpId,  'branchcode': empHosCode, 'is_showBelowLevel': inputShowBelowLevelReviewPo, 'is_trade': inputPoWaitReviewIsTrade},
		  beforeSend: null,
		  success: function(data) {
		  	if(data.aaData.length>0){
					$('#waiting-review-po-datatable').dataTable().fnAddData(data.aaData);
					var tmpDataList=data.aaData;
					for(var i in tmpDataList){
						poWaitingReviewDataList[tmpDataList[i].po_id]=tmpDataList[i];
					}
					onDTCheckboxChangeFunctionPoWaitingReview();
				}
			},
		  dataType: "json",
		  async:true,
		  complete: null
		});	
	}
}
function validatePoApproveForm(){
	var passValidate=true;

	//check input bottom up

	if(passValidate){
		if($("#poWaitApproveItemTotalChoose").val()=='0'){
			passValidate=false;
			openModal("fail","กรุณาเลือกข้อมูลในรายการ",false,null);
		}
		else{
			openModal("ยืนยัน","ยืนยัน อนุมัติ?",true,function(){
				$("#form-po-approve").html('');
				$("#form-po-approve").append('<input type="hidden" name="poAction" value="approve"/>');
				var dataTable=$("#waiting-approve-po-datatable");
				var nodes =  dataTable.DataTable().rows().nodes();
				$('.dt-checkbox', nodes).not('.disabled').each(function(){
					if($(this).is(":checked")){
						$("#form-po-approve").append('<input type="hidden" name="po_ids[]" value="'+poWatingApproveDataList[$(this).val()].po_id+'"/>');
					}
				});

				var options = { 
			      target: null,
			      type: 'post',
			      dataType:  'json',
			      url: poPostBulkUrl,
			      beforeSubmit:  function(){
			      	showPageLoading();
			      },
			      success: function(data){
			      	hidePageLoading();
			      	if(data.error!=""){
			      		openModal("fail",data.error,false,null);
			      	}
			      	else{
			      		openModal("success","บันทึกสำเร็จ",false,null);
			      		getDatatableDataForPoApprove();
			      	}
			      }
			  };
			  $("#form-po-approve").ajaxSubmit(options);

			});
		}
	}

	return false;
}
function validatePoReviewForm(){
	var passValidate=true;

	//check input bottom up

	if(passValidate){
		if($("#poWaitReviewItemTotalChoose").val()=='0'){
			passValidate=false;
			openModal("fail","กรุณาเลือกข้อมูลในรายการ",false,null);
		}
		else{
			openModal("ยืนยัน","ยืนยัน ตรวจสอบ?",true,function(){
				$("#form-po-review").html('');
				$("#form-po-review").append('<input type="hidden" name="poAction" value="review"/>');
				var dataTable=$("#waiting-review-po-datatable");
				var nodes =  dataTable.DataTable().rows().nodes();
				$('.dt-checkbox', nodes).not('.disabled').each(function(){
					if($(this).is(":checked")){
						$("#form-po-review").append('<input type="hidden" name="po_ids[]" value="'+poWaitingReviewDataList[$(this).val()].po_id+'"/>');
					}
				});

				var options = { 
			      target: null,
			      type: 'post',
			      dataType:  'json',
			      url: poPostBulkUrl,
			      beforeSubmit:  function(){
			      	showPageLoading();
			      },
			      success: function(data){
			      	hidePageLoading();
			      	if(data.error!=""){
			      		openModal("fail",data.error,false,null);
			      	}
			      	else{
			      		openModal("success","บันทึกสำเร็จ",false,null);
			      		getDatatableDataForPoReview();
			      	}
			      }
			  };
			  $("#form-po-review").ajaxSubmit(options);

			});
		}
	}

	return false;
}
function getDatatableDataForPrApprove(){
	$('#waiting-approve-pr-datatable').dataTable().fnClearTable();
	prWaitingApproveDataList=new Array();
	onDTCheckboxChangeFunctionPrWaitingApprove();

	if(empHosCode!=""){
		$.ajax({
		  type: 'POST',
		  url: purchaseApiBaseUrl+'/pr/waiting_approve',
		  data: {'emp_id': userEmpId,  'branchcode': empHosCode},
		  beforeSend: null,
		  success: function(data) {
		  	if(data.aaData.length>0){
					$('#waiting-approve-pr-datatable').dataTable().fnAddData(data.aaData);
					var tmpDataList=data.aaData;
					for(var i in tmpDataList){
						prWaitingApproveDataList[tmpDataList[i].pr_id]=tmpDataList[i];
					}
					onDTCheckboxChangeFunctionPrWaitingApprove();
				}
			},
		  dataType: "json",
		  async:true,
		  complete: null
		});	
	}
}
function validatePrApproveForm(){
	var passValidate=true;

	//check input bottom up

	if(passValidate){
		if($("#prWaitApproveItemTotalChoose").val()=='0'){
			passValidate=false;
			openModal("fail","กรุณาเลือกข้อมูลในรายการ",false,null);
		}
		else{
			openModal("ยืนยัน","ยืนยัน อนุมัติ?",true,function(){
				$("#form-pr-approve").html('');
				$("#form-pr-approve").append('<input type="hidden" name="prAction" value="approve"/>');
				var dataTable=$("#waiting-approve-pr-datatable");
				var nodes =  dataTable.DataTable().rows().nodes();
				$('.dt-checkbox', nodes).not('.disabled').each(function(){
					if($(this).is(":checked")){
						$("#form-pr-approve").append('<input type="hidden" name="pr_ids[]" value="'+prWaitingApproveDataList[$(this).val()].pr_id+'"/>');
						$("#form-pr-approve").append('<input type="hidden" name="is_waiting_approve2s[]" value="'+prWaitingApproveDataList[$(this).val()].is_waiting_approve2+'"/>');
						$("#form-pr-approve").append('<input type="hidden" name="is_waiting_approve3s[]" value="'+prWaitingApproveDataList[$(this).val()].is_waiting_approve3+'"/>');
					}
				});

				var options = { 
			      target: null,
			      type: 'post',
			      dataType:  'json',
			      url: prPostBulkUrl,
			      beforeSubmit:  function(){
			      	showPageLoading();
			      },
			      success: function(data){
			      	hidePageLoading();
			      	if(data.error!=""){
			      		openModal("fail",data.error,false,null);
			      	}
			      	else{
			      		openModal("success","บันทึกสำเร็จ",false,null);
			      		getDatatableDataForPrApprove();
			      	}
			      }
			  };
			  $("#form-pr-approve").ajaxSubmit(options);

			});
		}
	}

	return false;
}

function getDatatableDataForChequeCashApprove(){
	var approve_type_id = 'cheque_cash';
	$('#waiting-approve-'+approve_type_id+'-datatable').dataTable().fnClearTable();
	waitingApproveDataLists[approve_type_id]=new Array();
	onDTCheckboxChangeFunctionWaitingApproves[approve_type_id]();

	if(empHosCode!=""){
		$.ajax({
		  type: 'POST',
		  url: apApiBaseUrl+'/cheque/waiting_approve',
		  data: {'emp_id': userEmpId,  'branchcode': empHosCode},
		  beforeSend: null,
		  success: function(data) {
		  	if(data.aaData.length>0){
					$("#section-waiting-approve-"+approve_type_id).show();
					$('#waiting-approve-'+approve_type_id+'-datatable').dataTable().fnAddData(data.aaData);
					var tmpDataList=data.aaData;
					for(var i in tmpDataList){
						waitingApproveDataLists[approve_type_id][tmpDataList[i].cheque_running_id]=tmpDataList[i];
					}
					onDTCheckboxChangeFunctionWaitingApproves[approve_type_id]();
				}
				else{
					$("#section-waiting-approve-"+approve_type_id).hide();
				}
			},
		  dataType: "json",
		  async:true,
		  complete: null
		});	
	}
}
function validateChequeCashApproveForm(is_reject){
	var passValidate=true;
	var approve_type_id = 'cheque_cash';
	if(is_reject==null){
		is_reject = 'F';
	}

	//check input bottom up
	if(passValidate){
		if($("#chequeCashWaitApproveItemTotalChoose").val()=='0'){
			passValidate=false;
			openModal("fail","กรุณาเลือกข้อมูลในรายการ",false,null);
		}
		else{
			var confirmText = "ยืนยัน อนุมัติ?";
			if(is_reject=='T'){
				confirmText = "ยืนยัน ไม่อนุมัติ?";
			}
			openModal("ยืนยัน",confirmText,true,function(){
				var form = $("#form-"+approve_type_id+"-approve");
				form.html('');
				form.append('<input type="hidden" name="chequeCashApproveAction" value="approve"/>');
				form.append('<input type="hidden" name="emp_id" value="'+userEmpId+'"/>');
				form.append('<input type="hidden" name="is_reject" value="'+is_reject+'"/>');
				var dataTable=$("#waiting-approve-"+approve_type_id+"-datatable");
				var nodes =  dataTable.DataTable().rows().nodes();
				$('.dt-checkbox', nodes).not('.disabled').each(function(){
					if($(this).is(":checked")){
						form.append('<input type="hidden" name="cheque_running_ids[]" value="'+waitingApproveDataLists[approve_type_id][$(this).val()].cheque_running_id+'"/>');
					}
				});

				var options = { 
			      target: null,
			      type: 'post',
			      dataType:  'json',
			      url: apApiBaseUrl+'/cheque/approve_bulk',
			      beforeSubmit:  function(){
			      	showPageLoading();
			      },
			      success: function(data){
			      	hidePageLoading();
			      	if(data.error!=""){
			      		openModal("fail",data.error,false,null);
			      	}
			      	else{
			      		openModal("success","บันทึกสำเร็จ",false,null);
			      		getDatatableDataForChequeCashApprove();
			      	}
			      }
			  };
			  form.ajaxSubmit(options);

			});
		}
	}

	return false;
}

if(viewName=="home-index"){
	var projectCalendar=null;
	$(document).ready(function() {
		/*var bpkDataTable_FavDoc=$('#fav-doc-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
						returnHtml+='<a href="'+documentViewUrl+'/'+full.document_id+'" target="_blank" class="btn btn-primary margin-right3" rel="tooltip" data-title="Preview"><i class="glyphicon glyphicon-eye-open"></i></a>';
						if(full.view_only!='T'){
		        	returnHtml+='<a href="'+documentPrintUrl+'/'+full.document_id+'" target="_blank" class="btn btn-danger margin-right3" rel="tooltip" data-title="Print"><i class="glyphicon glyphicon-print"></i></a>'
        								+'<a href="'+documentDownloadUrl+'/'+full.document_id+'" target="_blank" class="btn btn-success margin-right3" rel="tooltip" data-title="Download"><i class="glyphicon glyphicon-download"></i></a>';
        		}
        		else{
		        	returnHtml+='<button class="btn btn-info margin-right3 disabled" rel="tooltip" data-title="Print"><i class="glyphicon glyphicon-print"></i></button>'
        								+'<button class="btn btn-info margin-right3 disabled" rel="tooltip" data-title="Download"><i class="glyphicon glyphicon-download"></i></button>';
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

		$("#table-fav-doc-submit").click(function(){
			bpkDataTableSearchSubmit(bpkDataTable_FavDoc);
			return false;
		});*/
		

		var dataTableCustomColumnDef_News=[
			{ "responsivePriority": 1, "targets": 0 },
			{ "responsivePriority": 2, "targets": 1 },
			{ "responsivePriority": 3, "targets": -1 },
			{ "bSortable": false, "aTargets": [ "sort-false" ] },
			{ "bSearchable": false, "aTargets": [ "search-false" ] }
		];

		//Table News
		bpkDataTable_News=$('#news-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef_News,
			"aoColumns": [
        { 	"mData" : null, "sClass": "right" },
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return '<a target="_blank" href="'+newsViewUrl+'/'+full.news_id+'">'+full.news_name+'</a>'+(full.is_read=="0"?'<small>(Unread)</small>':'');
				}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.news_type_detail;
				}
				}
	     ],
	    "aaSorting": [[ 1, "asc" ]],
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
	      aoData.push( { "name": "is_home", "value": 'T' } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);

        var body = $( bpkDataTable_News.table().body() );
        body.highlight( bpkDataTable_News.search() );  
			}
		});

		$("#table-news-submit").click(function(){
			bpkDataTableSearchSubmit(bpkDataTable_News);
			return false;
		});


		//Table Task
		var bpkDataTableTask=$('#task-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
						if(full.attachment_count>0){
							return '<i class="glyphicon glyphicon-file"></i>';
						}
						else{
							return '';
						}
					}
				},
	      { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+taskViewUrl+'/'+full.task_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
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

		// $("#table-project-submit").click(function(){
		// 	bpkDataTableSearchSubmit(bpkDataTableProject);
		// 	return false;
		// });


		//Table Project
		var bpkDataTableProject=$('#project-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
							return '<span class="label label-danger">'+full.request_priority_detail+'</span>';
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
						if(full.project_status_id=='2'){
							return full.project_status_detail+'<br/>('+(full.incomplete_task==0?'<i class="glyphicon glyphicon-ok"></i>':'<i class="glyphicon glyphicon-remove"></i>')+')';
						}
						else{
							return full.project_status_detail;
						}
					}
				},
	      { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+projectViewUrl+'/'+full.project_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
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
			      aoData.push( { "name": "is_ior", "value": $("#inputProjectViewType_IsIor").is(":checked")?'T':'' } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		$("#table-project-submit").click(function(){
			bpkDataTableSearchSubmit(bpkDataTableProject);
			return false;
		});

		$("#inputProjectViewType_Project").change(function(){
			bpkDataTableSearchSubmit(bpkDataTableProject);
		});
		$("#inputProjectViewType_IsIor").click(function(){
			bpkDataTableSearchSubmit(bpkDataTableProject);
		});

		//Table Project Incharge
		var bpkDataTableProjectIncharge=$('#project-incharge-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
							return '<span class="label label-danger">'+full.request_priority_detail+'</span>';
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
							return full.project_status_detail+'<br/>('+(full.incomplete_task==0?'<i class="glyphicon glyphicon-ok"></i>':'<i class="glyphicon glyphicon-remove"></i>')+')';
						}
						else{
							return full.project_status_detail;
						}
					}
				},
	      { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+projectViewUrl+'/'+full.project_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
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

		$("#table-project-submit").click(function(){
			bpkDataTableSearchSubmit(bpkDataTableProjectIncharge);
			return false;
		});

		//Table Project Inform
		var bpkDataTableProjectInform=$('#project-inform-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
							return '<span class="label label-danger">'+full.request_priority_detail+'</span>';
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
						return '<a target="_blank" href="'+projectViewUrl+'/'+full.project_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
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


		//Table Waiting Approve
		var bpkDataTableWaitingApprove=$('#waiting-approve-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
							return '<span class="label label-danger">'+full.request_priority_detail+'</span>';
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
						return '<a target="_blank" href="'+projectViewUrl+'/'+full.project_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
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

		$("#inputProjectViewType_WaitingApproveProject").change(function(){
			bpkDataTableSearchSubmit(bpkDataTableWaitingApprove);
		});


		//Table Waiting Approver
		var bpkDataTableWaitingApprover=$('#waiting-approver-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
							return '<span class="label label-danger">'+full.request_priority_detail+'</span>';
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
						return '<a target="_blank" href="'+projectViewUrl+'/'+full.project_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
					}
				}
	    ],
	    "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl_WaitingApprover,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		onDTCheckboxChangeFunctionPoWaitingApprove=function(){
				var total=0;
				var countChoose=0;
				var dataTable=$("#waiting-approve-po-datatable");
				var nodes =  dataTable.dataTable().fnGetNodes();
				$('.dt-checkbox', nodes).not('.disabled').each(function(){
					if($(this).is(":checked")){
						total+=parseFloat(poWatingApproveDataList[$(this).val()].total_price);
						countChoose++;
					}
					else{
					}
				});

				$("#poWaitApproveItemTotalAmt").val(parseFloat(total).formatMoney(2,'.',','));
				$("#poWaitApproveItemTotalChoose").val(countChoose);
			};

		if(see_waiting_approve_po){
			var bpkDataTableWaitingApprovePo=$('#waiting-approve-po-datatable').DataTable({
				'tabIndex': -1,
				"responsive": true,
				"searchDelay": sSearchDelay,
				"sPaginationType": "full_numbers",
				"aoColumnDefs": dataTableCustomColumnDef,
				"aoColumns": [
		            { 	"mData" : null, "sClass": "center",
						"mRender": function ( data, type, full ) {	
							return '<input type="checkbox" name="inputDTCheckbox[]" class="dt-checkbox" value="'+full.po_id+'" />';						
						}
					},
		            { 	"mData" : null, "sClass": "right" },
		            { 	"mData" : null, "sClass": "center",
						"mRender": function ( data, type, full ) {
							return full.po_code;
						}
					},
		            { 	"mData" : null, 
						"mRender": function ( data, type, full ) {
							var html = '-';
							html+=nl2br(full.item_list);
							if(full.item_details!=null && full.item_details!=''){
								html+='<hr/>';
								if(full.item_details.length>100){
									html+='-'+nl2br(full.item_details.substring(0,100))+'<a href="#" title="'+full.item_details+'" attr-detail="'+full.item_details+'" onclick="openModalViewFullDetail2(this); return false;">...Show More</a>';
								}
								else{
									html+='-'+nl2br(full.item_details);
								}
							}

							return html;
						}
					},
		            { 	"mData" : null, 
						"mRender": function ( data, type, full ) {
							return full.distributor_id+' - '+full.distributor_name;
						}
					},
		            { 	"mData" : null,  "sClass": "center",
						"mRender": function ( data, type, full ) {
							if(full.receive_date!=null){
								return full.receive_date.substring(0,10);
							}
							else return '';
						}
					},
		            { 	"mData" : null,  "sClass": "center",
						"mRender": function ( data, type, full ) {
							return full.create_date;
						}
					},
		            { 	"mData" : null,  "sClass": "left",
						"mRender": function ( data, type, full ) {
							var pr_codes = full.pr_codes;
							if(pr_codes==null || pr_codes=='') return '';
							var pr_ids = full.pr_ids;
							if(pr_ids==null || pr_ids=='') return '';
							var pr_code_list = full.pr_codes.split(',');
							var pr_id_list = full.pr_ids.split(',');
							var html = '';
							for(var i in pr_id_list){
								var pr_id = pr_id_list[i];
								var pr_code = pr_code_list[i];
								html+='-<a target="_blank" href="'+prViewUrl+'/'+pr_id+'">'+pr_code+'</a><br/>';
							}
							return html;
						}
					},
					{ 	"mData" : null, "sClass": "left",
						"mRender": function ( data, type, full ) {
							return full.department_name;
						}
					},
		            { 	"mData" : null, "sClass": "right",
						"mRender": function ( data, type, full ) {
							return parseFloat(full.total_price).formatMoney(2,'.',',');
						}
					},
					{ 	"mData" : null, "sClass": "center",
						"mRender": function ( data, type, full ) {
							if(full.is_trade=='T') return 'Trade';
							return 'Non-trade';
						}
					},
					{ 	"mData" : null, "sClass": "left",
						"mRender": function ( data, type, full ) {
							return full.create_by_emp_name;
						}
					},
					{ 	"mData" : null, "sClass": "center",
						"mRender": function ( data, type, full ) {
							return '<a target="_blank" href="'+poViewUrl+'/'+full.po_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
						}
					}
		        ],
		        "aaSorting": [[ 6, "asc" ]],
				"bProcessing": true,		
				"aaData" : null,
				"fnServerParams": function ( aoData ) {
				},
				"fnDrawCallback": function ( oSettings ) {
					bpkDataTableDrawCallback(oSettings,null,true,'1',getDatatableDataForPoApprove);
					initDTCheckbox('waiting-approve-po-datatable',onDTCheckboxChangeFunctionPoWaitingApprove);
					onDTCheckboxChangeFunctionPoWaitingApprove();
				},
				"iDisplayLength": 10,
				'fixedHeader': true
			});

			getDatatableDataForPoApprove();
			$("#inputShowBelowLevel").click(function(){
				getDatatableDataForPoApprove();
			});
			$("#inputPoWaitApproveHospitalId").change(function(){
				getDatatableDataForPoApprove();
			});
			$("#inputPoWaitApproveIsTrade").change(function(){
				getDatatableDataForPoApprove();
			});
		}

		onDTCheckboxChangeFunctionPoWaitingReview=function(){
				var total=0;
				var countChoose=0;
				var dataTable=$("#waiting-review-po-datatable");
				var nodes =  dataTable.dataTable().fnGetNodes();
				$('.dt-checkbox', nodes).not('.disabled').each(function(){
					if($(this).is(":checked")){
						total+=parseFloat(poWaitingReviewDataList[$(this).val()].total_price);
						countChoose++;
					}
					else{
					}
				});

				$("#poWaitReviewItemTotalAmt").val(parseFloat(total).formatMoney(2,'.',','));
				$("#poWaitReviewItemTotalChoose").val(countChoose);
			};

		if(see_waiting_review_po){
			var bpkDataTableWaitingReviewPo=$('#waiting-review-po-datatable').DataTable({
				'tabIndex': -1,
				"responsive": true,
				"searchDelay": sSearchDelay,
				"sPaginationType": "full_numbers",
				"aoColumnDefs": dataTableCustomColumnDef,
				"aoColumns": [
		            { 	"mData" : null, "sClass": "center",
						"mRender": function ( data, type, full ) {	
							return '<input type="checkbox" name="inputDTCheckbox[]" class="dt-checkbox" value="'+full.po_id+'" />';						
						}
					},
		            { 	"mData" : null, "sClass": "right" },
		            { 	"mData" : null, "sClass": "left",
						"mRender": function ( data, type, full ) {
							var html = '';

							if(full.pr_attachment_count>0 || full.po_attachment_count>0){
								html+= '<i class="glyphicon glyphicon-file"></i>';
							}

							return html+''+full.po_code;
						}
					},
		            { 	"mData" : null, 
						"mRender": function ( data, type, full ) {
							var html = '-';
							html+=nl2br(full.item_list);
							if(full.item_details!=null && full.item_details!=''){
								html+='<hr/>';
								if(full.item_details.length>100){
									html+='-'+nl2br(full.item_details.substring(0,100))+'<a href="#" title="'+full.item_details+'" attr-detail="'+full.item_details+'" onclick="openModalViewFullDetail2(this); return false;">...Show More</a>';
								}
								else{
									html+='-'+nl2br(full.item_details);
								}
							}

							return html;
						}
					},
		            { 	"mData" : null, 
						"mRender": function ( data, type, full ) {
							return full.distributor_id+' - '+full.distributor_name;
						}
					},
		            { 	"mData" : null,  "sClass": "center",
						"mRender": function ( data, type, full ) {
							if(full.receive_date!=null){
								return full.receive_date.substring(0,10);
							}
							else return '';
						}
					},
		            { 	"mData" : null,  "sClass": "center",
						"mRender": function ( data, type, full ) {
							return full.create_date;
						}
					},
		            { 	"mData" : null,  "sClass": "left",
						"mRender": function ( data, type, full ) {
							var pr_codes = full.pr_codes;
							if(pr_codes==null || pr_codes=='') return '';
							var pr_ids = full.pr_ids;
							if(pr_ids==null || pr_ids=='') return '';
							var pr_code_list = full.pr_codes.split(',');
							var pr_id_list = full.pr_ids.split(',');
							var html = '';
							for(var i in pr_id_list){
								var pr_id = pr_id_list[i];
								var pr_code = pr_code_list[i];
								html+='-<a target="_blank" href="'+prViewUrl+'/'+pr_id+'">'+pr_code+'</a><br/>';
							}
							return html;
						}
					},
					{ 	"mData" : null, "sClass": "left",
						"mRender": function ( data, type, full ) {
							return full.department_name;
						}
					},
		            { 	"mData" : null, "sClass": "right",
						"mRender": function ( data, type, full ) {
							return parseFloat(full.total_price).formatMoney(2,'.',',');
						}
					},
					{ 	"mData" : null, "sClass": "center",
						"mRender": function ( data, type, full ) {
							if(full.is_trade=='T') return 'Trade';
							return 'Non-trade';
						}
					},
					{ 	"mData" : null, "sClass": "left",
						"mRender": function ( data, type, full ) {
							return full.create_by_emp_name;
						}
					},
					{ 	"mData" : null, "sClass": "center",
						"mRender": function ( data, type, full ) {
							return '<a target="_blank" href="'+poViewUrl+'/'+full.po_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
						}
					}
		        ],
		        "aaSorting": [[ 6, "asc" ]],
				"bProcessing": true,		
				"aaData" : null,
				"fnServerParams": function ( aoData ) {
				},
				"fnDrawCallback": function ( oSettings ) {
					bpkDataTableDrawCallback(oSettings,null,true,'1',getDatatableDataForPoReview);
					initDTCheckbox('waiting-review-po-datatable',onDTCheckboxChangeFunctionPoWaitingReview);
					onDTCheckboxChangeFunctionPoWaitingReview();
				},
				"iDisplayLength": 10,
				'fixedHeader': true
			});

			getDatatableDataForPoReview();
			$("#inputShowBelowLevelReviewPo").click(function(){
				getDatatableDataForPoReview();
			});
			$("#inputPoWaitReviewIsTrade").change(function(){
				getDatatableDataForPoReview();
			});
		}

		onDTCheckboxChangeFunctionPrWaitingApprove=function(){
				var total=0;
				var countChoose=0;
				var dataTable=$("#waiting-approve-pr-datatable");
				var nodes =  dataTable.dataTable().fnGetNodes();
				$('.dt-checkbox', nodes).not('.disabled').each(function(){
					if($(this).is(":checked")){
						// total+=parseFloat(prWaitingApproveDataList[$(this).val()].total_price);
						countChoose++;
					}
					else{
					}
				});

				// $("#prWaitApproveItemTotalAmt").val(parseFloat(total).formatMoney(2,'.',','));
				$("#prWaitApproveItemTotalChoose").val(countChoose);
			};

		if(see_waiting_approve_pr){
			var bpkDataTableWaitingApprovePr=$('#waiting-approve-pr-datatable').DataTable({
				"responsive": true,
				"searchDelay": sSearchDelay,
				"sPaginationType": "full_numbers",
				"aoColumnDefs": dataTableCustomColumnDef,
				"aoColumns": [
		            { 	"mData" : null, "sClass": "center",
						"mRender": function ( data, type, full ) {	
							return '<input type="checkbox" name="inputDTCheckbox[]" class="dt-checkbox" value="'+full.pr_id+'" />';						
						}
					},
		            { 	"mData" : null, "sClass": "right" },
		            { 	"mData" : null, "sClass": "center",
						"mRender": function ( data, type, full ) {
							return full.pr_code;
						}
					},
		            { 	"mData" : null, "sClass": "center",
						"mRender": function ( data, type, full ) {
							return full.stock_id;
						}
					},
		            { 	"mData" : null, "sClass": "left",
						"mRender": function ( data, type, full ) {
							return full.stock_name;
						}
					},
		            { 	"mData" : null, 
						"mRender": function ( data, type, full ) {
							return '-'+nl2br(full.item_list);
						}
					},
		            { 	"mData" : null,  "sClass": "center",
						"mRender": function ( data, type, full ) {
							return full.create_date;
						}
					},
					{ 	"mData" : null, "sClass": "left",
						"mRender": function ( data, type, full ) {
							return full.create_by_emp_name;
						}
					},
					{ 	"mData" : null, "sClass": "center",
						"mRender": function ( data, type, full ) {
							return '<a target="_blank" href="'+prViewUrl+'/'+full.pr_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
						}
					}
		        ],
		    "aaSorting": [[ 2, "asc" ]],
				"bProcessing": true,		
				"aaData" : null,
				"fnServerParams": function ( aoData ) {
				},
				"fnDrawCallback": function ( oSettings ) {
					bpkDataTableDrawCallback(oSettings,null,true,'1',getDatatableDataForPrApprove);
					initDTCheckbox('waiting-approve-pr-datatable',onDTCheckboxChangeFunctionPrWaitingApprove);
					onDTCheckboxChangeFunctionPrWaitingApprove();
				},
				"iDisplayLength": 10,
				'fixedHeader': true
			});

			getDatatableDataForPrApprove();
		}

		
		onDTCheckboxChangeFunctionWaitingApproves['cheque_cash']=function(){
				var total=0;
				var countChoose=0;
				var dataTable=$("#waiting-approve-cheque_cash-datatable");
				var nodes =  dataTable.dataTable().fnGetNodes();
				$('.dt-checkbox', nodes).not('.disabled').each(function(){
					if($(this).is(":checked")){
						total+=parseFloat(waitingApproveDataLists['cheque_cash'][$(this).val()].amt);
						countChoose++;
					}
					else{
					}
				});

				$("#chequeCashWaitApproveItemTotalAmt").val(parseFloat(total).formatMoney(2,'.',','));
				$("#chequeCashWaitApproveItemTotalChoose").val(countChoose);
			};

		if(see_waiting_approves['cheque_cash']){
			$('#waiting-approve-cheque_cash-datatable').DataTable({
				"responsive": true,
				"searchDelay": sSearchDelay,
				"sPaginationType": "full_numbers",
				"aoColumnDefs": dataTableCustomColumnDef,
				"aoColumns": [
		            { 	"mData" : null, "sClass": "center",
						"mRender": function ( data, type, full ) {	
							return '<input type="checkbox" name="inputDTCheckbox[]" class="dt-checkbox" value="'+full.cheque_running_id+'" />';						
						}
					},
		            { 	"mData" : null, "sClass": "right" },
		            { 	"mData" : null, "sClass": "center",
						"mRender": function ( data, type, full ) {
							return full.bank_cheque_no;
						}
					},
		            { 	"mData" : null, 
						"mRender": function ( data, type, full ) {
							return full.bank_name;
						}
					},
		            { 	"mData" : null,  "sClass": "center",
						"mRender": function ( data, type, full ) {
							if(full.cheque_date!=null){
								return full.cheque_date.substring(0,10);
							}
							else return '';
						}
					},
		            { 	"mData" : null,  "sClass": "center",
						"mRender": function ( data, type, full ) {
							return full.receipt_id;
						}
					},
		            { 	"mData" : null, 
						"mRender": function ( data, type, full ) {
							return full.receive_name;
						}
					}, { 	"mData" : null,  "sClass": "left",
						"mRender": function ( data, type, full ) {
							return full.ap_note;
						}
					},
		            { 	"mData" : null, "sClass": "right",
						"mRender": function ( data, type, full ) {
							if(full.amt==null) return '';
							return parseFloat(full.amt).formatMoney(2,'.',',');
						}
					},
		            { 	"mData" : null,  "sClass": "center",
						"mRender": function ( data, type, full ) {
							return full.cheque_status_detail;
						}
					},
		            { 	"mData" : null, 
						"mRender": function ( data, type, full ) {
							return full.note;
						}
					}
		        ],
		    "aaSorting": [[ 4, "asc" ]],
				"bProcessing": true,		
				"aaData" : null,
				"fnServerParams": function ( aoData ) {
				},
				"fnDrawCallback": function ( oSettings ) {
					bpkDataTableDrawCallback(oSettings,null,true,'1',getDatatableDataForChequeCashApprove);
					initDTCheckbox('waiting-approve-cheque_cash-datatable',onDTCheckboxChangeFunctionWaitingApproves['cheque_cash']);
					onDTCheckboxChangeFunctionWaitingApproves['cheque_cash']();
				},
				"iDisplayLength": 10,
				'fixedHeader': true
			});

			getDatatableDataForChequeCashApprove();
		}

		//Table Project Track
		bpkDataTableProjectTrack=$('#project-track-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
						return '<a target="_blank" href="'+projectViewUrl+'/'+full.project_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
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

	});

	var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();

	var alreadyInitCalendar=false;

	/*
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
	*/

	var project_id=$("#inputCalendarProjectId").val();
  projectCalendar=$('#calendar').fullCalendar({
  	schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
    resourceLabelText: 'Calendar',
    defaultView: 'month',
  	theme: 'bootstrap3',
		height: 450,
		editable: false,
		resourceAreaWidth: 200,
		header: {
      left: 'timelineDay,timelineWeek,timelineMonth,month',
      center: 'title',
		  right: 'prev,next'
		},
		eventSources: [
	  ],
		allDaySlot: false,
		timeFormat: 'HH:mm',
	  eventRender: function(event, element) {
	    element.qtip({
	      content: event.description
	    });
	  },
	  eventClick: function(calEvent, jsEvent, view) {
	  }
  });

	$("#inputCalendarSelectEmp,#inputCalendarSelectProject, #calendarCheckboxPlanToPlan, #calendarCheckboxPlanToFinish, #calendarCheckboxAcceptToFinish").change(function(){
		refreshProjectCalendar();
	});
	$("#tab-section-calendar").click(function(){
		refreshProjectCalendar();
	});
}
//end home-index


//est_cost-pyh
function estCostPyhCalTotalPrice(){
	var totalPrice = 0;
	for(var i in estCostPyhList){
		if(isNaN(estCostPyhList[i].total_price)){
			totalPrice='';
			break;
		}
		if(estCostPyhList[i].total_price=='') continue;
		totalPrice+=estCostPyhList[i].total_price;
	}
	if(totalPrice==''){
		$("#inputTotalPrice").val('');
		$("#estCostTotalPrice").text('ราคารวม: ');
		$("#inputPatientEstCost").val('');
	}
	else{
		$("#inputTotalPrice").val(totalPrice);
		totalPrice = parseFloat(totalPrice).formatMoney(2,'.',',');
		$("#estCostTotalPrice").text('ราคารวม: '+totalPrice+' บาท');
		$("#inputPatientEstCost").val(totalPrice);
	}

	estCostGetSummaryTable();
}

function estCostPyhCalLineItemPrice(param1){
	estCostPyhList[param1].total_price='';
	if(estCostPyhList[param1].price!='' && !isNaN(estCostPyhList[param1].price)
		&& estCostPyhList[param1].qty!='' && !isNaN(estCostPyhList[param1].qty)){
		estCostPyhList[param1].total_price = estCostPyhList[param1].price * estCostPyhList[param1].qty;
	}

	$("input[name^='inputEditTotalPrice_'][ind='"+param1+"']",'#est-cost-pyh-datatable').val(estCostPyhList[param1].total_price);

	estCostPyhCalTotalPrice();
}
function estCostPyhOnChangeItem_Item(selectedText,selectedValue,param1,selectedObject){
	if(selectedObject!=null){
		estCostPyhList[param1].item_id=selectedObject.item_id;
		estCostPyhList[param1].item_name=selectedObject.item_name;
		estCostPyhList[param1].item_common_name=selectedObject.common_name;
		estCostPyhList[param1].billing_group_id=selectedObject.billing_group_id;
		estCostPyhList[param1].billing_group_code=selectedObject.billing_group_code;
		estCostPyhList[param1].billing_group_desc=selectedObject.billing_group_desc;
		estCostPyhList[param1].item_code=selectedObject.item_code;
		estCostPyhList[param1].default_item_price=selectedObject.default_item_price;
		estCostPyhList[param1].price=selectedObject.item_price;
		estCostPyhList[param1].unit=selectedObject.unit;
		estCostPyhList[param1].item_avg_cost=selectedObject.item_avg_cost;
	}
	else{
		estCostPyhList[param1].item_id='';
		estCostPyhList[param1].item_name='';
		estCostPyhList[param1].item_common_name='';
		estCostPyhList[param1].billing_group_id='';
		estCostPyhList[param1].billing_group_code='';
		estCostPyhList[param1].billing_group_desc='';
		estCostPyhList[param1].item_code='';
		estCostPyhList[param1].default_item_price='';
		estCostPyhList[param1].price='';
		estCostPyhList[param1].unit='';
		estCostPyhList[param1].item_avg_cost=null;
	}
	$("input[name^='inputEditItemCode_'][ind='"+param1+"']",'#est-cost-pyh-datatable').val(estCostPyhList[param1].item_code);
	$("input[name^='inputEditItemName_'][ind='"+param1+"']",'#est-cost-pyh-datatable').val(estCostPyhList[param1].item_name);
	$("span[name='spanItemName_'][ind='"+param1+"']",'#est-cost-pyh-datatable').html(estCostPyhList[param1].item_name);
	$("span[name='spanUnit_'][ind='"+param1+"']",'#est-cost-pyh-datatable').html(estCostPyhList[param1].unit);
	$("input[name^='inputEditItemCommonName_'][ind='"+param1+"']",'#est-cost-pyh-datatable').val(estCostPyhList[param1].item_common_name);
	$("span[name=default_item_price][ind='"+param1+"']",'#est-cost-pyh-datatable').html(parseFloat(estCostPyhList[param1].default_item_price).formatMoney(2,'.',','));
	$("input[name^='inputEditPrice_'][ind='"+param1+"']",'#est-cost-pyh-datatable').val(estCostPyhList[param1].price);
	$("input[name^='inputEditUnit_'][ind='"+param1+"']",'#est-cost-pyh-datatable').val(estCostPyhList[param1].unit);
	$("span[name=item_avg_cost][ind='"+param1+"']",'#est-cost-pyh-datatable').html(parseFloat(estCostPyhList[param1].item_avg_cost).formatMoney(2,'.',','));
	$("span[name=item_avg_cost_total][ind='"+param1+"']",'#est-cost-pyh-datatable').html(parseFloat(estCostPyhList[param1].item_avg_cost * estCostPyhList[param1].qty).formatMoney(2,'.',','));

	var selectize = $("select[name^='inputEditBillingGroup_'][ind='"+param1+"']",'#est-cost-pyh-datatable').get(0).selectize;
	if(selectize!==undefined){
		var data = estCostPyhList[param1];
		selectize.addOption([{billing_group_id:data.billing_group_id, billing_group_code:data.billing_group_code, billing_group_desc:data.billing_group_desc}]);
		selectize.setValue([data.billing_group_id]);
	}

	estCostPyhCalLineItemPrice(param1);
}

function estCostPyhOnChangeItem_Place(selectedText,selectedValue,param1,selectedObject){
	if(selectedObject!=null){
		estCostPyhList[param1].place_running_id=selectedObject.place_running_id;
		estCostPyhList[param1].place_code=selectedObject.place_code;
	}
	else{
		estCostPyhList[param1].place_running_id='';
		estCostPyhList[param1].place_code='';
	}
}

function estCostPyhOnChangeItem_BillingGroup(selectedText,selectedValue,param1,selectedObject){
	if(selectedObject!=null){
		estCostPyhList[param1].billing_group_id=selectedObject.billing_group_id;
		estCostPyhList[param1].billing_group_code=selectedObject.billing_group_code;
		estCostPyhList[param1].billing_group_desc=selectedObject.billing_group_desc;
	}
	else{
		estCostPyhList[param1].billing_group_id='';
		estCostPyhList[param1].billing_group_code='';
		estCostPyhList[param1].billing_group_desc='';
	}
}


function initEstCostPyhInput(){
  var dataTable=$("#est-cost-pyh-datatable");
	var nodes =  dataTable.DataTable().rows({ page: 'current' }).nodes();
  for(var i=0;i<nodes.length;i++){
  	var node = nodes[i];
  	var data = estCostPyhList[i];

	  $("select[name^='inputEditItemId_']", node).each(function(){
			var elem=this;
	  	var ind=$(this).attr('ind');
			var paramKeys=new Array();
			paramKeys.push('branchcode');
			paramKeys.push('base_tariff_id');
			var paramElems=new Array();
	  	paramElems.push("#inputHospitalId");
	  	paramElems.push("#inputBaseTariffId");
	  	var options={'can_create':true,'createOnBlur':true,'persist':true,'restore_on_backspace':true};
			var selectize=initSelectizeRemote2(elem, 1, 'item_id', 'item_name', ['item_name'],  'item_name', false, ajaxGetItemRemoteForEstCostUrl,'estCostPyhOnChangeItem_Item',paramKeys,paramElems,i, options, false);
			selectize=selectize[0].selectize;
			clearSelectize(selectize);
			if(data.item_id!=''){
				selectize.addOption([{item_id:data.item_id, item_name:data.item_name, common_name:data.item_common_name, item_code:data.item_code
					, billing_group_id:data.billing_group_id, billing_group_code:data.billing_group_code, billing_group_desc:data.billing_group_desc
					, item_price:data.price, default_item_price:data.default_item_price, unit:data.unit, item_avg_cost:data.item_avg_cost}]);
				selectize.setValue([data.item_id]);
			}
	  });

	  $("select[name^='inputEditBillingGroup_']", node).each(function(){
			var elem=this;
	  	var ind=$(this).attr('ind');
			var paramKeys=new Array();
			paramKeys.push('hos_id');
			var paramElems=new Array();
	  	paramElems.push("#inputHospitalId");
	  	var selectize=initSelectizeRemote2(elem, 1, 'billing_group_id', 'billing_group_desc', ['billing_group_code','billing_group_desc'],  'billing_group_code', true, ajaxGetBillingGroupSelectizeUrl,'estCostPyhOnChangeItem_BillingGroup',paramKeys,paramElems,i, null, false);
			selectize=selectize[0].selectize;
			clearSelectize(selectize);
			if(data.billing_group_id!=''){
				selectize.addOption([{billing_group_id:data.billing_group_id, billing_group_code:data.billing_group_code, billing_group_desc:data.billing_group_desc}]);
				selectize.setValue([data.billing_group_id]);
			}
	  });

	  $("input[name^='inputEditQty_']", node).each(function(){
	  	$(this).val(data.qty);
	  	$(this).keyup(function(){
	  		var ind=$(this).attr('ind');
	  		estCostPyhList[ind].qty=$(this).val();
	  		estCostPyhCalLineItemPrice(ind);
	  		if(estCostPyhList[ind].item_avg_cost!=null){
	  			$('span[name=item_avg_cost_total][ind='+ind+']').html(parseFloat(estCostPyhList[ind].item_avg_cost * estCostPyhList[ind].qty).formatMoney(2,'.',','));
	  		}
				$("span[name='spanQty_'][ind='"+ind+"']",'#est-cost-pyh-datatable').html(estCostPyhList[ind].qty);
	  	});
	  });

	  $("input[name^='inputEditUnit_']", node).each(function(){
	  	$(this).val(data.unit);
	  	$(this).keyup(function(){
	  		var ind=$(this).attr('ind');
	  		estCostPyhList[ind].unit=$(this).val();
				$("span[name='spanUnit_'][ind='"+ind+"']",'#est-cost-pyh-datatable').html(estCostPyhList[ind].unit);
	  	});
	  });

	  $("input[name^='inputEditPrice_']", node).each(function(){
	  	$(this).val(data.price);
	  	$(this).keyup(function(){
	  		var ind=$(this).attr('ind');
	  		estCostPyhList[ind].price=$(this).val();
	  		estCostPyhCalLineItemPrice(ind);
				$("span[name='spanPrice_'][ind='"+ind+"']",'#est-cost-pyh-datatable').html(estCostPyhList[ind].price);
	  	});
	  });

	  $("input[name^='inputEditTotalPrice_']", node).each(function(){
	  	$(this).val(data.total_price);
	  	$(this).keyup(function(){
	  	// 	var ind=$(this).attr('ind');
	  	// 	estCostPyhList[ind].total_price=$(this).val();
	  	// 	estCostPyhCalTotalPrice();
				// $("span[name='spanTotalPrice_'][ind='"+ind+"']",'#est-cost-pyh-datatable').html(estCostPyhList[ind].total_price);
	  	});
	  });
	}
}

function estCostChooseItemCalLineItemPrice(param1){
	estCostChooseItemList[param1].total_price='';
	if(estCostChooseItemList[param1].price!='' && !isNaN(estCostChooseItemList[param1].price)
		&& estCostChooseItemList[param1].qty!='' && !isNaN(estCostChooseItemList[param1].qty)){
		estCostChooseItemList[param1].total_price = estCostChooseItemList[param1].price * estCostChooseItemList[param1].qty;
	}

	$("input[name^='inputEditTotalPrice_'][ind='"+param1+"']",'#choose-item-modal-datatable').val(estCostChooseItemList[param1].total_price);
}
function estCostChooseItemOnChangeItem_Item(selectedText,selectedValue,param1,selectedObject){
	if(selectedObject!=null){
		estCostChooseItemList[param1].item_id=selectedObject.item_id;
		estCostChooseItemList[param1].item_name=selectedObject.item_name;
		estCostChooseItemList[param1].item_common_name=selectedObject.common_name;
		estCostChooseItemList[param1].billing_group_id=selectedObject.billing_group_id;
		estCostChooseItemList[param1].billing_group_code=selectedObject.billing_group_code;
		estCostChooseItemList[param1].billing_group_desc=selectedObject.billing_group_desc;
		estCostChooseItemList[param1].item_code=selectedObject.item_code;
		estCostChooseItemList[param1].default_item_price=selectedObject.default_item_price;
		estCostChooseItemList[param1].price=selectedObject.item_price;
		estCostChooseItemList[param1].unit=selectedObject.unit;
		estCostChooseItemList[param1].item_avg_cost=selectedObject.item_avg_cost;
	}
	else{
		estCostChooseItemList[param1].item_id='';
		estCostChooseItemList[param1].item_name='';
		estCostChooseItemList[param1].item_common_name='';
		estCostChooseItemList[param1].billing_group_id='';
		estCostChooseItemList[param1].billing_group_code='';
		estCostChooseItemList[param1].billing_group_desc='';
		estCostChooseItemList[param1].item_code='';
		estCostChooseItemList[param1].default_item_price='';
		estCostChooseItemList[param1].price='';
		estCostChooseItemList[param1].unit='';
		estCostChooseItemList[param1].item_avg_cost=null;
	}
	$("input[name^='inputEditItemCode_'][ind='"+param1+"']",'#choose-item-modal-datatable').val(estCostChooseItemList[param1].item_code);
	$("input[name^='inputEditItemName_'][ind='"+param1+"']",'#choose-item-modal-datatable').val(estCostChooseItemList[param1].item_name);
	$("span[name='spanItemName_'][ind='"+param1+"']",'#choose-item-modal-datatable').html(estCostChooseItemList[param1].item_name);
	$("span[name='spanUnit_'][ind='"+param1+"']",'#choose-item-modal-datatable').html(estCostChooseItemList[param1].unit);
	$("input[name^='inputEditItemCommonName_'][ind='"+param1+"']",'#choose-item-modal-datatable').val(estCostChooseItemList[param1].item_common_name);
	$("span[name=default_item_price][ind='"+param1+"']",'#choose-item-modal-datatable').html(parseFloat(estCostChooseItemList[param1].default_item_price).formatMoney(2,'.',','));
	$("input[name^='inputEditPrice_'][ind='"+param1+"']",'#choose-item-modal-datatable').val(estCostChooseItemList[param1].price);
	$("input[name^='inputEditUnit_'][ind='"+param1+"']",'#choose-item-modal-datatable').val(estCostChooseItemList[param1].unit);
	$("span[name=item_avg_cost][ind='"+param1+"']",'#choose-item-modal-datatable').html(parseFloat(estCostChooseItemList[param1].item_avg_cost).formatMoney(2,'.',','));
	$("span[name=item_avg_cost_total][ind='"+param1+"']",'#choose-item-modal-datatable').html(parseFloat(estCostChooseItemList[param1].item_avg_cost * estCostChooseItemList[param1].qty).formatMoney(2,'.',','));

	var selectize = $("select[name^='inputEditBillingGroup_'][ind='"+param1+"']",'#choose-item-modal-datatable').get(0).selectize;
	if(selectize!==undefined){
		var data = estCostChooseItemList[param1];
		selectize.addOption([{billing_group_id:data.billing_group_id, billing_group_code:data.billing_group_code, billing_group_desc:data.billing_group_desc}]);
		selectize.setValue([data.billing_group_id]);
	}

	estCostChooseItemCalLineItemPrice(param1);
}
function estCostChooseItemOnChangeItem_BillingGroup(selectedText,selectedValue,param1,selectedObject){
	if(selectedObject!=null){
		estCostChooseItemList[param1].billing_group_id=selectedObject.billing_group_id;
		estCostChooseItemList[param1].billing_group_code=selectedObject.billing_group_code;
		estCostChooseItemList[param1].billing_group_desc=selectedObject.billing_group_desc;
	}
	else{
		estCostChooseItemList[param1].billing_group_id='';
		estCostChooseItemList[param1].billing_group_code='';
		estCostChooseItemList[param1].billing_group_desc='';
	}
}
function initEstCostChooseItemInput(){
  var dataTable=$("#choose-item-modal-datatable");
	var nodes =  dataTable.DataTable().rows({ page: 'current' }).nodes();
  for(var i=0;i<nodes.length;i++){
  	var node = nodes[i];
  	var data = estCostChooseItemList[i];

	  $("input.dt-checkbox", node).each(function(){
	  	if(data.is_checked=='T'){
	  		$(this).prop('checked',true);
	  	}
	  	else{
	  		$(this).prop('checked',false);
	  	}
	  });

	  $("select[name^='inputEditItemId_']", node).each(function(){
			var elem=this;
	  	var ind=$(this).attr('ind');
			var paramKeys=new Array();
			paramKeys.push('branchcode');
			paramKeys.push('base_tariff_id');
			var paramElems=new Array();
	  	paramElems.push("#inputHospitalId");
	  	paramElems.push("#inputBaseTariffId");
	  	var options={'can_create':true,'createOnBlur':true,'persist':true,'restore_on_backspace':true};
			var selectize=initSelectizeRemote2(elem, 1, 'item_id', 'item_name', ['item_name'],  'item_name', false, ajaxGetItemRemoteForEstCostUrl,'estCostChooseItemOnChangeItem_Item',paramKeys,paramElems,i, options, false);
			selectize=selectize[0].selectize;
			clearSelectize(selectize);
			if(data.item_id!=''){
				selectize.addOption([{item_id:data.item_id, item_name:data.item_name, common_name:data.item_common_name, item_code:data.item_code
					, billing_group_id:data.billing_group_id, billing_group_code:data.billing_group_code, billing_group_desc:data.billing_group_desc
					, item_price:data.price, default_item_price:data.default_item_price, unit:data.unit, item_avg_cost:data.item_avg_cost}]);
				selectize.setValue([data.item_id]);
			}
	  });

	  $("select[name^='inputEditBillingGroup_']", node).each(function(){
			var elem=this;
	  	var ind=$(this).attr('ind');
			var paramKeys=new Array();
			paramKeys.push('hos_id');
			var paramElems=new Array();
	  	paramElems.push("#inputHospitalId");
	  	var selectize=initSelectizeRemote2(elem, 1, 'billing_group_id', 'billing_group_desc', ['billing_group_code','billing_group_desc'],  'billing_group_code', true, ajaxGetBillingGroupSelectizeUrl,'estCostChooseItemOnChangeItem_BillingGroup',paramKeys,paramElems,i, null, false);
			selectize=selectize[0].selectize;
			clearSelectize(selectize);
			if(data.billing_group_id!=''){
				selectize.addOption([{billing_group_id:data.billing_group_id, billing_group_code:data.billing_group_code, billing_group_desc:data.billing_group_desc}]);
				selectize.setValue([data.billing_group_id]);
			}
	  });

	  $("input[name^='inputEditQty_']", node).each(function(){
	  	$(this).val(data.qty);
	  	$(this).keyup(function(){
	  		var ind=$(this).attr('ind');
	  		estCostChooseItemList[ind].qty=$(this).val();
	  		estCostChooseItemCalLineItemPrice(ind);
	  		if(estCostChooseItemList[ind].item_avg_cost!=null){
	  			$('span[name=item_avg_cost_total][ind='+ind+']').html(parseFloat(estCostChooseItemList[ind].item_avg_cost * estCostChooseItemList[ind].qty).formatMoney(2,'.',','));
	  		}
				$("span[name='spanQty_'][ind='"+ind+"']",'#choose-item-modal-datatable').html(estCostChooseItemList[ind].qty);
	  	});
	  });

	  $("input[name^='inputEditUnit_']", node).each(function(){
	  	$(this).val(data.unit);
	  	$(this).keyup(function(){
	  		var ind=$(this).attr('ind');
	  		estCostChooseItemList[ind].unit=$(this).val();
				$("span[name='spanUnit_'][ind='"+ind+"']",'#choose-item-modal-datatable').html(estCostChooseItemList[ind].unit);
	  	});
	  });

	  $("input[name^='inputEditPrice_']", node).each(function(){
	  	$(this).val(data.price);
	  	$(this).keyup(function(){
	  		var ind=$(this).attr('ind');
	  		estCostChooseItemList[ind].price=$(this).val();
	  		estCostChooseItemCalLineItemPrice(ind);
				$("span[name='spanPrice_'][ind='"+ind+"']",'#choose-item-modal-datatable').html(estCostChooseItemList[ind].price);
	  	});
	  });

	  $("input[name^='inputEditTotalPrice_']", node).each(function(){
	  	$(this).val(data.total_price);
	  	$(this).keyup(function(){
	  	// 	var ind=$(this).attr('ind');
	  	// 	estCostChooseItemList[ind].total_price=$(this).val();
	  	// 	estCostChooseItemCalTotalPrice();
				// $("span[name='spanTotalPrice_'][ind='"+ind+"']",'#choose-item-modal-datatable').html(estCostChooseItemList[ind].total_price);
	  	});
	  });
	}
}

function estCostCurrentVisitItemClear(){
	estCostCurrentVisitItemList=new Array();
	estCostCurrentVisitItemList.push({
		'item_id' : '',
		'item_code' : '',
		'item_name' : '',
		'item_common_name' : '',
		'billing_group_id' : '',
		'billing_group_code' : '',
		'billing_group_desc' : '',
		'qty' : '',
		'unit' : '',
		'default_item_price' : '',
		'price' : '',
		'total_price' : '',
		'item_avg_cost' : null
	});

	estCostCurrentVisitItemReindexItem();
	refreshEstCostCurrentVisitItem();
}

function estCostPyhClear(){

	$('#est-cost-pyh-datatable').dataTable().fnClearTable();
	$('#est-cost-current-visit-item-datatable').dataTable().fnClearTable();

	estCostPyhList=new Array();
	estCostPyhList.push({
		'item_id' : '',
		'item_code' : '',
		'item_name' : '',
		'item_common_name' : '',
		'billing_group_id' : '',
		'billing_group_code' : '',
		'billing_group_desc' : '',
		'qty' : '',
		'unit' : '',
		'default_item_price' : '',
		'price' : '',
		'total_price' : '',
		'item_avg_cost' : null
	});

	estCostPyhReindexItem();
	refreshEstCostPyhItem();

	estCostCurrentVisitItemClear();
	estCostSummaryItemClear();
}	

function estCostSummaryItemClear(){
	estCostSummaryItemList=new Array();
	estCostSummaryItemList.push({
		'billing_group_id' : '',
		'billing_group_code' : '',
		'billing_group_desc' : '',
		'total_price' : ''
	});

	estCostSummaryItemReindexItem();
	refreshEstCostSummaryItem();
}

function addNewEstCostSummaryItem(position,data){
	if(data==null){
		data = estCostSummaryItemList[position];
		data = JSON.parse(JSON.stringify(data));
	}
	estCostSummaryItemList.splice(position+1,0,data);

	estCostSummaryItemReindexItem();
	refreshEstCostSummaryItem();
}

function deleteNewEstCostSummaryItem(position){
	if(estCostSummaryItemList.length<=1){
		return;
	}

	estCostSummaryItemList.splice(position,1);

	estCostSummaryItemReindexItem();
	refreshEstCostSummaryItem();
}

function estCostSummaryItemReindexItem(){
	//re-index
	var ind=0;
	for(var i in estCostSummaryItemList){
		estCostSummaryItemList[i].i=i;
		estCostSummaryItemList[i].no=ind+1;
		ind++;
	}
}

function refreshEstCostSummaryItem(){
	$('#est-cost-summary-item-datatable').dataTable().fnClearTable();

	if(estCostSummaryItemList.length>0){
  	$('#est-cost-summary-item-datatable').DataTable().rows.add(estCostSummaryItemList).draw();
	}

	if(estCostSummaryItemList.length<=1){
		$(".btn-est-cost-summary-item-table-remove").addClass('disabled');
	}
	else{
		$(".btn-est-cost-summary-item-table-remove").removeClass('disabled');		
	}
}

function addNewEstCostCurrentVisitItem(position,data){
	if(data==null){
		data = estCostCurrentVisitItemList[position];
		data = JSON.parse(JSON.stringify(data));
	}
	estCostCurrentVisitItemList.splice(position+1,0,data);

	estCostCurrentVisitItemReindexItem();
	refreshEstCostCurrentVisitItem();
}

function deleteNewEstCostCurrentVisitItem(position){
	if(estCostCurrentVisitItemList.length<=1){
		return;
	}

	estCostCurrentVisitItemList.splice(position,1);

	estCostCurrentVisitItemReindexItem();
	refreshEstCostCurrentVisitItem();
}

function estCostCurrentVisitItemCompareBillingGroup(a,b){
	return a.billing_group_code.localeCompare(b.billing_group_code); // compare string
}
function estCostCurrentVisitItemSortByBillingGroup(){
	estCostCurrentVisitItemList.sort(estCostCurrentVisitItemCompareBillingGroup);

	estCostCurrentVisitItemReindexItem();
	refreshEstCostCurrentVisitItem();
}

function estCostCurrentVisitItemReindexItem(){
	//re-index
	var ind=0;
	for(var i in estCostCurrentVisitItemList){
		estCostCurrentVisitItemList[i].i=i;
		estCostCurrentVisitItemList[i].no=ind+1;
		ind++;
	}
}

function refreshEstCostCurrentVisitItem(){
	$('#est-cost-current-visit-item-datatable').dataTable().fnClearTable();

	if(estCostCurrentVisitItemList.length>0){
  	$('#est-cost-current-visit-item-datatable').DataTable().rows.add(estCostCurrentVisitItemList).draw();
	}

	if(estCostCurrentVisitItemList.length<=1){
		$(".btn-est-cost-current-visit-item-table-remove").addClass('disabled');
	}
	else{
		$(".btn-est-cost-current-visit-item-table-remove").removeClass('disabled');		
	}
}

function addNewEstCostPyh(position,data){
	if(data==null){
		data = estCostPyhList[position];
		data = JSON.parse(JSON.stringify(data));
	}
	estCostPyhList.splice(position+1,0,data);

	estCostPyhReindexItem();
	refreshEstCostPyhItem();
}

function deleteNewEstCostPyh(position){
	if(estCostPyhList.length<=1){
		return;
	}

	estCostPyhList.splice(position,1);

	estCostPyhReindexItem();
	refreshEstCostPyhItem();
}

function estCostCompareBillingGroup(a,b){
	return a.billing_group_code.localeCompare(b.billing_group_code); // compare string
}
function estCostSortByBillingGroup(){
	estCostPyhList.sort(estCostCompareBillingGroup);

	estCostPyhReindexItem();
	refreshEstCostPyhItem();
}

function estCostPyhReindexItem(){
	//re-index
	var ind=0;
	for(var i in estCostPyhList){
		estCostPyhList[i].i=i;
		estCostPyhList[i].no=ind+1;
		ind++;
	}
}

function refreshEstCostPyhItem(){
	$('#est-cost-pyh-datatable').dataTable().fnClearTable();

	if(estCostPyhList.length>0){
  	$('#est-cost-pyh-datatable').DataTable().rows.add(estCostPyhList).draw();
	}

	if(estCostPyhList.length<=1){
		$(".btn-est-cost-pyh-table-remove").addClass('disabled');
	}
	else{
		$(".btn-est-cost-pyh-table-remove").removeClass('disabled');		
	}
}
function estCostChooseItemModalConfirm(){
	if(estCostPyhList.length==1 && estCostPyhList[0].item_id==''){
		estCostPyhList = new Array();
	}
	for(var i in estCostChooseItemList){
		if(estCostChooseItemList[i].is_checked=='T'){
			var est_cost_item = estCostChooseItemList[i];
			estCostPyhList.push({
				'item_id' : est_cost_item.item_id,
				'item_code' : est_cost_item.item_code,
				'item_name' : est_cost_item.item_name,
				'item_common_name' : est_cost_item.item_name,
				'billing_group_id' : est_cost_item.billing_group_id,
				'billing_group_code' : est_cost_item.billing_group_code,
				'billing_group_desc' : est_cost_item.billing_group_desc,
				'qty' : est_cost_item.qty,
				'unit' : est_cost_item.unit,
				'price' : est_cost_item.price,
				'default_item_price' : est_cost_item.default_item_price,
				'total_price' : est_cost_item.total_price,
				'item_avg_cost' : null
			});
		}
	}
	$('#estCostChooseItemModal').modal('hide');
	showPageLoading();
	setTimeout(function(){
		estCostPyhReindexItem();
		refreshEstCostPyhItem();
		scrollToElem($("#form-table-est-cost"));
		hidePageLoading();
	},300);
}
function addNewEstCostChooseItem(position,data){
	if(data==null){
		data = estCostChooseItemList[position];
		data = JSON.parse(JSON.stringify(data));
	}
	estCostChooseItemList.splice(position+1,0,data);

	estCostChooseItemReindexItem();
	refreshEstCostChooseItemItem();
}

function deleteNewEstCostChooseItem(position){
	if(estCostChooseItemList.length<=1){
		return;
	}

	estCostChooseItemList.splice(position,1);

	estCostChooseItemReindexItem();
	refreshEstCostChooseItemItem();
}

function estCostChooseItemSortByBillingGroup(){
	estCostChooseItemList.sort(estCostCompareBillingGroup);

	estCostChooseItemReindexItem();
	refreshEstCostChooseItemItem();
}

function estCostChooseItemReindexItem(){
	//re-index
	var ind=0;
	for(var i in estCostChooseItemList){
		estCostChooseItemList[i].i=i;
		estCostChooseItemList[i].no=ind+1;
		ind++;
	}
}

function refreshEstCostChooseItemItem(){
	$('#choose-item-modal-datatable').dataTable().fnClearTable();

	if(estCostChooseItemList.length>0){
  	$('#choose-item-modal-datatable').DataTable().rows.add(estCostChooseItemList).draw();
	}

	if(estCostChooseItemList.length<=1){
		$(".btn-est-cost-choose-item-remove").addClass('disabled');
	}
	else{
		$(".btn-est-cost-choose-item-remove").removeClass('disabled');		
	}
}

function estCostCurrentVisitItemGetData(){
	if($("#inputEditEstCostId").val()!='-1'){
		return;
	}
	estCostCurrentVisitItemClear();
	var hn = $("#inputEstCostCurrentPatient").val();
	var hos_id = $("#inputHospitalId").val();
	$.ajax({
		type: 'POST',
		url: estCostCurrentVisitGetDataUrl,
		data:  {'hn':hn,'branchcode':hos_id},
		dataType: "json",
		async:true,
    beforeSubmit:  function(){
      showPageLoading();
    },
		success: function(data) {
      hidePageLoading();

      if(data.items!=null){
      	var est_cost_items = data.items;
      	var base_tariff_id = data.base_tariff_id;
      	if(base_tariff_id!=null){
      		var selectize = $("#inputBaseTariffId").get(0).selectize;
      		selectize.setValue(base_tariff_id);
      	}
				estCostCurrentVisitItemList=new Array();
      	for(var i in est_cost_items){
      		var est_cost_item = est_cost_items[i];
					estCostCurrentVisitItemList.push({
						'item_id' : est_cost_item.item_id,
						'item_code' : est_cost_item.item_code,
						'item_name' : est_cost_item.item_name,
						'item_common_name' : est_cost_item.item_name,
						'billing_group_id' : est_cost_item.billing_group_id,
						'billing_group_code' : est_cost_item.billing_group_code,
						'billing_group_desc' : est_cost_item.billing_group_desc,
						'qty' : est_cost_item.qty,
						'unit' : est_cost_item.unit,
						'price' : est_cost_item.price,
						'total_price' : est_cost_item.total_price,
						'item_avg_cost' : est_cost_item.item_avg_cost
					});
      	}
				estCostCurrentVisitItemReindexItem();
				refreshEstCostCurrentVisitItem();

				estCostGetSummaryTable();
      }
    }
  });
}

function estCostGetSummaryTable(){
	estCostSummaryItemList=new Array();
	for(var i in estCostPyhList){
		var est_cost_item = estCostPyhList[i];
		var billing_group_code = est_cost_item.billing_group_code;
		if(billing_group_code==null || billing_group_code=='') continue;
		var isExist = false;
		var ind = 0;
		for(var j in estCostSummaryItemList){
			if(estCostSummaryItemList[j].billing_group_code==billing_group_code){
				isExist=true;
				ind = j;
				break;
			}
		}
		if(!isExist){
			var estCostSummaryItem = {};
			estCostSummaryItem.billing_group_id = est_cost_item.billing_group_id;
			estCostSummaryItem.billing_group_code = est_cost_item.billing_group_code;
			estCostSummaryItem.billing_group_desc = est_cost_item.billing_group_desc;
			estCostSummaryItem.total_price = 0;
			estCostSummaryItemList.push(estCostSummaryItem);
			ind = estCostSummaryItemList.length-1;
		}
		estCostSummaryItemList[ind].total_price+=parseFloat(est_cost_item.total_price);
	}
	for(var i in estCostCurrentVisitItemList){
		var est_cost_item = estCostCurrentVisitItemList[i];
		var billing_group_code = est_cost_item.billing_group_code;
		if(billing_group_code==null || billing_group_code=='') continue;
		var isExist = false;
		var ind = 0;
		for(var j in estCostSummaryItemList){
			if(estCostSummaryItemList[j].billing_group_code==billing_group_code){
				isExist=true;
				ind = j;
				break;
			}
		}
		if(!isExist){
			var estCostSummaryItem = {};
			estCostSummaryItem.billing_group_id = est_cost_item.billing_group_id;
			estCostSummaryItem.billing_group_code = est_cost_item.billing_group_code;
			estCostSummaryItem.billing_group_desc = est_cost_item.billing_group_desc;
			estCostSummaryItem.total_price = 0;
			estCostSummaryItemList.push(estCostSummaryItem);
			ind = estCostSummaryItemList.length-1;
		}
		estCostSummaryItemList[ind].total_price+=parseFloat(est_cost_item.total_price);
	}
	estCostSummaryItemReindexItem();
	refreshEstCostSummaryItem();


	var totalPrice = 0;
	for(var i in estCostSummaryItemList){
		if(isNaN(estCostSummaryItemList[i].total_price)){
			totalPrice='';
			break;
		}
		totalPrice+=estCostSummaryItemList[i].total_price;
	}
	if(totalPrice==''){
		$("#estCostSummaryTotalPrice").text('ราคารวม: ');
	}
	else{
		totalPrice = parseFloat(totalPrice).formatMoney(2,'.',',');
		$("#estCostSummaryTotalPrice").text('ราคารวม: '+totalPrice+' บาท');
	}
}

function openEstCostPyh(){
	selectingEditButton=null;
	estCostPyhClear();

	if($("#inputEditEstCostId").val()!='-1'){
		$("#form-table-est-cost-current-visit-item").hide();
		$.ajax({
			type: 'POST',
			url: estCostPyhGetDataUrl,
			data:  {'est_cost_id':$("#inputEditEstCostId").val()},
			dataType: "json",
			async:true,
      beforeSubmit:  function(){
        showPageLoading();
      },
			success: function(data) {
	      hidePageLoading();
	      if(data.est_cost_data!=null){
	      	var est_cost_data = data.est_cost_data;

      		currentEstCostId = est_cost_data.est_cost_id;
      		$("#buttonEstCostPrintPyhForm").show();
      		$("#buttonEstCostPrintPyhFormByBilling").show();
	      	$("#buttonEstCostPrintMedOpinionForm").show();

	      	refreshComboBox($("#inputHospitalId"),est_cost_data.hos_id);
	      	$("#inputHN").val(est_cost_data.hn);
	      	$("#inputRoom").val(est_cost_data.room);

	      	estCostBaseTariffInit(est_cost_data.hos_id, est_cost_data.base_tariff_id);

	      	$("#inputPID").val(est_cost_data.pid);
	      	refreshComboBox($("#inputNationalityId"),est_cost_data.nationality_id);
	      	$("#inputPassportNo").val(est_cost_data.passport_no);
	      	$("#inputAgentId").val(est_cost_data.agent_id);
	      	$("#inputAge").val(est_cost_data.age);

					var selectize = $("#inputTitleName").get(0).selectize;
					selectize.addOption({'value':est_cost_data.titlename,'text':est_cost_data.titlename});
					selectize.setValue(est_cost_data.titlename);

	      	$("#inputFirstName").val(est_cost_data.firstname);
	      	$("#inputLastName").val(est_cost_data.lastname);
	      	$("#inputCondition").val(est_cost_data.condition);
	      	$("#inputDoctorName").val(est_cost_data.doctor_name);
	      	$("#inputVisitDay").val(est_cost_data.visit_day);
	      	$("#inputOpLengthHour").val(est_cost_data.op_length_hour);
	      	$("#inputOpLengthMin").val(est_cost_data.op_length_min);
	      	$("#inputTotalPrice").val(est_cost_data.patient_est_cost);
	      	$("#inputPatientEstCost").val(parseFloat(est_cost_data.patient_est_cost).formatMoney(2,'.',','));


					var selectize = $("#inputEstCostCurrentPatient").get(0).selectize;
					selectize.addOption({'bpk_hn':est_cost_data.hn,'hn':est_cost_data.hn,
						'prename': est_cost_data.prename,
						'firstname': est_cost_data.firstname,
						'lastname': est_cost_data.lastname,
						'fix_nationality_id': est_cost_data.nationality_id,
						'detail':est_cost_data.hn+' '+est_cost_data.titlename+' '+est_cost_data.firstname+' '+est_cost_data.lastname});
					selectize.setValue(est_cost_data.hn, true);
					selectize.disable();
					estCostCurrentVisitItemGetData();
	      }

	      if(data.est_cost_items!=null){
	      	var est_cost_items = data.est_cost_items;
					estCostPyhList=new Array();
	      	for(var i in est_cost_items){
	      		var est_cost_item = est_cost_items[i];
						estCostPyhList.push({
							'item_id' : est_cost_item.item_id,
							'item_code' : est_cost_item.item_code,
							'item_name' : est_cost_item.item_name,
							'item_common_name' : est_cost_item.item_name,
							'billing_group_id' : est_cost_item.billing_group_id,
							'billing_group_code' : est_cost_item.billing_group_code,
							'billing_group_desc' : est_cost_item.billing_group_desc,
							'qty' : est_cost_item.qty,
							'unit' : est_cost_item.unit,
							'price' : est_cost_item.price,
							'default_item_price' : est_cost_item.default_item_price,
							'total_price' : est_cost_item.total_price,
							'item_avg_cost' : null
						});
	      	}
					estCostPyhReindexItem();
					refreshEstCostPyhItem();

					estCostSortByBillingGroup();
					estCostGetSummaryTable();
	      }

	      if(data.est_cost_med_opinion!=null){
	      	var est_cost_med_opinion = data.est_cost_med_opinion;
	      	$("#inputMODocDate").val(est_cost_med_opinion.doc_date);
	      	$("#inputMODocTime").val(est_cost_med_opinion.doc_time);
	      	$("#inputMOConsultReceived").val(est_cost_med_opinion.received);
	      	$("#inputMOConsultPhysician").val(est_cost_med_opinion.consult_physician);
	      	$("#inputMODiagnosis").val(est_cost_med_opinion.diagnosis);
	      	$("#inputMOMedOpinion").val(est_cost_med_opinion.med_opinion);
	      	$("#inputMOTreatment").val(est_cost_med_opinion.treatment);
	      	$("#inputMOInvestigation1").val(est_cost_med_opinion.investigation1);
	      	$("#inputMOInvestigation1Cost").val(est_cost_med_opinion.investigation1_cost);
	      	$("#inputMOProcedure1").val(est_cost_med_opinion.procedure1);
	      	$("#inputMOProcedure1Time").val(est_cost_med_opinion.procedure1_time);
	      	$("#inputMOProcedure1Cost").val(est_cost_med_opinion.procedure1_cost);
	      	$("#inputMOProcedure2").val(est_cost_med_opinion.procedure2);
	      	$("#inputMOProcedure2Time").val(est_cost_med_opinion.procedure2_time);
	      	$("#inputMOProcedure2Cost").val(est_cost_med_opinion.procedure2_cost);
	      	$("#inputMODf").val(est_cost_med_opinion.df);
	      	$("#inputMODfCost").val(est_cost_med_opinion.df_cost);
	      	$("#inputMOSpecialEquipment").val(est_cost_med_opinion.special_equipment);
	      	$("#inputMOSpecialEquipmentCost").val(est_cost_med_opinion.special_equipment_cost);
	      	$("#inputMOLengthOfStay").val(est_cost_med_opinion.length_of_stay);
	      	$("#inputMOLengthOfStayCost").val(est_cost_med_opinion.length_of_stay_cost);
	      	$("#inputMOLengthRegularRoom").val(est_cost_med_opinion.l_regular_room);
	      	$("#inputMOLengthICU").val(est_cost_med_opinion.l_icu);
	      	$("#inputMOLengthStayInThai").val(est_cost_med_opinion.l_stay_in_thai);
	      }
			}
		});
	}

	$('#editEstCostPyhModal').modal({ dynamic: true, backdrop: false });
	setTimeout(function(){
		$('#editEstCostPyhModal').focus(); // add to fix bug on chrome when press esc
	},300);
}
function estCostPyhOnChangeTariff(base_tariff_id){
	if($("#inputEditEstCostId").val()!='-1'){
		$.ajax({
			type: 'POST',
			url: estCostPyhGetDataUrl,
			data:  {'est_cost_id':$("#inputEditEstCostId").val(),'base_tariff_id':base_tariff_id},
			dataType: "json",
			async:true,
      beforeSubmit:  function(){
        showPageLoading();
      },
			success: function(data) {
	      hidePageLoading();
	      if(data.est_cost_items!=null){
	      	var est_cost_items = data.est_cost_items;
	      	for(var i in est_cost_items){
	      		var est_cost_item = est_cost_items[i];
	      		for(var j in estCostPyhList){
	      			if(estCostPyhList[j].item_id==est_cost_item.item_id){
	      				estCostPyhList[j] = {
									'item_id' : est_cost_item.item_id,
									'item_code' : est_cost_item.item_code,
									'item_name' : est_cost_item.item_name,
									'item_common_name' : est_cost_item.item_name,
									'billing_group_id' : est_cost_item.billing_group_id,
									'billing_group_code' : est_cost_item.billing_group_code,
									'billing_group_desc' : est_cost_item.billing_group_desc,
									'qty' : est_cost_item.qty,
									'unit' : est_cost_item.unit,
									'price' : est_cost_item.price,
									'default_item_price' : est_cost_item.default_item_price,
									'total_price' : est_cost_item.total_price,
									'item_avg_cost' : null
								};
	      			}
	      		}
	      	}
					estCostPyhReindexItem();
					refreshEstCostPyhItem();
	      }
			}
		});
	}
}
function validateEstCostPyhTable(){
	var passValidate=true;

  $("#inputCountItem").val(estCostPyhList.length);

  /*
	if($("#inputCountItem").val()==0){
    openModal('fail','กรุณาระบุรายการในตารางประเมิน',false,null);
    passValidate=false;
	}
	*/

  i=0;
  var form = "#est-cost-pyh-datatable";
  $(form+" [name^='inputEditItemId_']").each(function() {
    i=$(this).attr('name').substring("inputEditItemId_".length);
    var ind=$(this).attr('ind');
    if($(form+" [name='inputEditItemId_"+i+"']").val()==''){
      openModal('fail','กรุณาระบุ รายการที่ '+i + ' ในตารางการประเมิน',false,null);
      passValidate=false;
      return false;
    }
  });

  return passValidate;
}
function validateEstCostPyhModalForm(){  
  count=0;
  var validate=0;

	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputLastName]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputFirstName]")) && passValidate;
	// passValidate=checkInputTypeSelect($("select[id=inputBaseTariffId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[id=inputHospitalId]")) && passValidate;

	if(!passValidate){
		return false;
	}

	passValidate = validateEstCostPyhTable() && passValidate;

	return passValidate;
}
function estCostPrintPyhForm(estCostId){
	if(estCostId==null) estCostId = currentEstCostId;
	window.open(estCostPrintPyhUrl+"/"+estCostId);
}
function estCostPrintPyhFormByBilling(estCostId){
	if(estCostId==null) estCostId = currentEstCostId;
	window.open(estCostPrintPyhUrl+"/"+estCostId+'?billing=T');
}
function estCostPrintMedOpinionForm(estCostId){
	if(estCostId==null) estCostId = currentEstCostId;
	window.open(estCostPrintMedOpinionUrl+"/"+estCostId);
}
function editEstCostPyhModalConfirm(){
  var urlSubmit=estCostPostPyhUrl;
  validate = validateEstCostPyhModalForm();
  if(validate==true){
  	var confirmText="ยืนยันบันทึก";
		openModal(confirmText,confirmText+"?",true,function(){
			$.ajax({
				type: 'POST',
				url: urlSubmit,
				data:  $('#form-est-hos').serialize() + "&" +$('#form-est-cost').serialize() + "&" + $('#form-table-est-cost').serialize() + "&" + $('#form-med-opinion').serialize() + "&current_visit_items=" + JSON.stringify(estCostCurrentVisitItemList),
				dataType: "json",
				async:true,
	      beforeSubmit:  function(){
	        showPageLoading();
	      },
				success: function(data) {
		      hidePageLoading();
	        if(data.error!=""){
	          openModal("fail",data.error,false,null);
	        }
	        else{
	      		openModal("success","บันทึกสำเร็จ",false,null);
	      		currentEstCostId = data.est_cost_id;
	      		$("#buttonEstCostPrintPyhForm").show();
	      		$("#buttonEstCostPrintPyhFormByBilling").show();
	      		$("#buttonEstCostPrintMedOpinionForm").show();
	        }
				}
			});
  	});
  }
}
function estCostBaseTariffChange(selectedText,selectedValue,param1,selectedObject){
	if(selectedObject!=null){
		$("#inputBaseTariffDesc").val(selectedObject.description);
	}
	else{
		$("#inputBaseTariffDesc").val('');
	}
}

function estCostBaseTariffInit(hos_id, selected_base_tariff_id){
	// var paramKeys=new Array();
	// paramKeys.push('branchcode');
	// var paramElems=new Array();
	// paramElems.push("#inputHospitalId");

	// var selectize=initSelectizeRemote2($("#inputBaseTariffId"), 1, 'base_tariff_id', 'description', ['description'],  'description', false, ajaxGetImedBaseTariffUrl,'estCostBaseTariffChange',paramKeys,paramElems,null, null, false);
	// selectize=selectize[0].selectize;
	// clearSelectize(selectize);

	var selectize = $("#inputBaseTariffId").get(0).selectize;
	selectize.clearOptions();
	$.ajax({
		type: 'GET',
		url: ajaxGetImedBaseTariffUrl,
		data:  {"branchcode":hos_id},
		dataType: "json",
		async:true,
		success: function(data) {
			for(var i in data){
				if(hos_id=='7' && data[i].base_tariff_id!='2' && data[i].base_tariff_id!='4'){
					//pyh
					continue;
				}
				if(hos_id=='5' && data[i].base_tariff_id!='2' && data[i].base_tariff_id!='4'){
					//bpk9
					continue;
				}
				selectize.addOption(data[i]); 
			}
			selectize.refreshOptions(false);
			if(selected_base_tariff_id!=null){
				selectize.setValue(selected_base_tariff_id);
			}
			else{
				if(hos_id=='7' || hos_id=='5'){
					selectize.setValue('4');
				}
			}
		}
	});
}
function estCostPyhSelectTemplate(){
	var est_cost_template_id = $("#inputItemFilterTemplate").val();
	if(est_cost_template_id=='') return;
	var base_tariff_id = $("#inputBaseTariffId").val();
	$.ajax({
		type: 'POST',
		url: estCostPyhGetTemplateItemUrl,
		data:  {'est_cost_template_id':est_cost_template_id,'base_tariff_id':base_tariff_id},
		dataType: "json",
		async:true,
    beforeSend:  function(){
      showPageLoading();
    },
		success: function(data) {
      hidePageLoading();
      if(data.est_cost_template_items!=null){
      	var est_cost_items = data.est_cost_template_items;
				estCostChooseItemList=new Array();
      	for(var i in est_cost_items){
      		var est_cost_item = est_cost_items[i];
					estCostChooseItemList.push({
						'is_checked' : 'F',
						'item_id' : est_cost_item.item_id,
						'item_code' : est_cost_item.item_code,
						'item_name' : est_cost_item.item_name,
						'item_common_name' : est_cost_item.item_name,
						'billing_group_id' : est_cost_item.billing_group_id,
						'billing_group_code' : est_cost_item.billing_group_code,
						'billing_group_desc' : est_cost_item.billing_group_desc,
						'qty' : est_cost_item.qty,
						'unit' : est_cost_item.unit,
						'price' : est_cost_item.price,
						'default_item_price' : est_cost_item.default_item_price,
						'total_price' : est_cost_item.total_price,
						'item_avg_cost' : null
					});
      	}
      	openEstCostChooseItemModal();
				estCostChooseItemReindexItem();
				refreshEstCostChooseItemItem();
      }
		}
	});
}
function estCostTemplateChange(selectedText,selectedValue,param1,selectedObject){
	if(selectedObject!=null){
		$("#btn-template-edit").show();
		$("#btn-template-delete").show();
		$("#btn-template-save-current").show();
	}
	else{
		$("#btn-template-edit").hide();
		$("#btn-template-delete").hide();
		$("#btn-template-save-current").hide();
	}
}
function estCostTemplateInit(){
	var paramKeys=new Array();
	paramKeys.push('branchcode');
	var paramElems=new Array();
	paramElems.push("#inputHospitalId");
	var selectize=initSelectizeRemote2($("#inputItemFilterTemplate"), 1, 'est_cost_template_id', 'template_name', ['template_name'],  'template_name', false, ajaxGetEstCostTemplateSelectizeUrl,'estCostTemplateChange',paramKeys,paramElems,null, null, false);
	selectize=selectize[0].selectize;
	clearSelectize(selectize);
}
function estCostPyhGetItemByVisit(visit_id){
	// var visit_id = $("#inputItemFilterChooseVisit").val();
	var hos_id = $("#inputHospitalId").val();
	$.ajax({
		type: 'GET',
		url: ajaxGetEstCostItemByVisitUrl,
		data:  {'visit_id':visit_id,'branchcode':hos_id},
		dataType: "json",
		async:true,
    beforeSend:  function(){
      showPageLoading();
    },
		success: function(data) {
      hidePageLoading();
      if(data.items!=null){
      	var est_cost_items = data.items;
				estCostChooseItemList=new Array();
      	for(var i in est_cost_items){
      		var est_cost_item = est_cost_items[i];
					estCostChooseItemList.push({
						'is_checked' : 'F',
						'item_id' : est_cost_item.item_id,
						'item_code' : est_cost_item.item_code,
						'item_name' : est_cost_item.item_name,
						'item_common_name' : est_cost_item.item_name,
						'billing_group_id' : est_cost_item.billing_group_id,
						'billing_group_code' : est_cost_item.billing_group_code,
						'billing_group_desc' : est_cost_item.billing_group_desc,
						'qty' : est_cost_item.qty,
						'unit' : est_cost_item.unit,
						'price' : est_cost_item.price,
						'total_price' : est_cost_item.total_price,
						'item_avg_cost' : est_cost_item.item_avg_cost
					});
      	}
      	openEstCostChooseItemModal();
				estCostChooseItemReindexItem();
				refreshEstCostChooseItemItem();
      }
		}
	});
}
function estCostChooseVisitChange(selectedText,selectedValue,param1,selectedObject){
	if(selectedObject!=null){
	}
	else{
	}
}
function estCostChooseVisitInit(){
	var paramKeys=new Array();
	paramKeys.push('branchcode');
	paramKeys.push('patient_id');
	paramKeys.push('icd9_code');
	paramKeys.push('icd10_code');
	paramKeys.push('doctor_eid');
	var paramElems=new Array();
	paramElems.push("#inputHospitalId");
	paramElems.push("#inputItemFilterChoosePatient");
	paramElems.push("#inputItemFilterIcd9");
	paramElems.push("#inputItemFilterIcd10");
	paramElems.push("#inputItemFilterDoctor");
	var selectize=initSelectizeRemote2($("#inputItemFilterChooseVisit"), 1, 'visit_id', 'detail', ['detail','vn','an','main_symptom'],  'detail', false, ajaxGetEstCostChooseVisitSelectizeUrl,'estCostChooseVisitChange',paramKeys,paramElems,null, null, false);
	selectize=selectize[0].selectize;
	clearSelectize(selectize);
}

function estCostChoosePatientChange(selectedText,selectedValue,param1,selectedObject){
	if(selectedObject!=null){
	}
	else{
	}
}
function estCostChoosePatientInit(){
	var paramKeys=new Array();
	paramKeys.push('branchcode');
	paramKeys.push('icd9_code');
	paramKeys.push('icd10_code');
	paramKeys.push('doctor_eid');
	var paramElems=new Array();
	paramElems.push("#inputHospitalId");
	paramElems.push("#inputItemFilterIcd9");
	paramElems.push("#inputItemFilterIcd10");
	paramElems.push("#inputItemFilterDoctor");
	var selectize=initSelectizeRemote2($("#inputItemFilterChoosePatient"), 1, 'patient_id', 'detail', ['detail','hn'],  'detail', false, ajaxGetEstCostChoosePatientSelectizeUrl,'estCostChoosePatientChange',paramKeys,paramElems,null, null, false);
	selectize=selectize[0].selectize;
	clearSelectize(selectize);
}

function estCostCurrentPatientChange(selectedText,selectedValue,param1,selectedObject){
	if(selectedObject!=null){
		var form = $("#section-patient-detail");
		$("#inputHN",form).val(selectedObject.bpk_hn);
		var selectize = $("#inputTitleName",form).get(0).selectize;
		selectize.addOption(selectedObject.prename);
		selectize.setValue(selectedObject.prename);
		$("#inputFirstName",form).val(selectedObject.firstname);
		$("#inputLastName",form).val(selectedObject.lastname);
		clearComboBox($("#inputNationalityId",form));
		refreshComboBox($("#inputNationalityId",form),selectedObject.fix_nationality_id);
	}
	else{
	}

	estCostCurrentVisitItemGetData();
}
function estCostCurrentPatientInit(){
	var paramKeys=new Array();
	paramKeys.push('branchcode');
	var paramElems=new Array();
	paramElems.push("#inputHospitalId");
	var selectize=initSelectizeRemote2($("#inputEstCostCurrentPatient"), 1, 'bpk_hn', 'detail', ['detail','hn'],  'detail', false, ajaxGetEstCostChoosePatientSelectizeUrl,'estCostCurrentPatientChange',paramKeys,paramElems,null, null, false);
	selectize=selectize[0].selectize;
	clearSelectize(selectize);
}

function estCostFilterDoctorChange(selectedText,selectedValue,param1,selectedObject){
	if(selectedObject!=null){
	}
	else{
	}
}
function estCostFilterDoctorInit(){
	var paramKeys=new Array();
	paramKeys.push('branchcode');
	var paramElems=new Array();
	paramElems.push("#inputHospitalId");
	var selectize=initSelectizeRemote2($("#inputItemFilterDoctor"), 1, 'employee_id', 'doctor_name', ['employee_id','doctor_name'],  'employee_id', true, ajaxGetImedDoctorUrl,'estCostFilterDoctorChange',paramKeys,paramElems,null, null, false);
	selectize=selectize[0].selectize;
	clearSelectize(selectize);
}
function estCostIcd9Change(selectedText,selectedValue,param1,selectedObject){
	if(selectedObject!=null){
	}
	else{
	}
}
function estCostIcd9Init(){
	var paramKeys=new Array();
	paramKeys.push('branchcode');
	var paramElems=new Array();
	paramElems.push("#inputHospitalId");
	var selectize=initSelectizeRemote2($("#inputItemFilterIcd9"), 1, 'code', 'description', ['code','description'],  'code', true, ajaxGetImedIcd9Url,'estCostIcd9Change',paramKeys,paramElems,null, null, false);
	selectize=selectize[0].selectize;
	clearSelectize(selectize);
}
function estCostIcd10Change(selectedText,selectedValue,param1,selectedObject){
	if(selectedObject!=null){
	}
	else{
	}
}
function estCostIcd10Init(){
	var paramKeys=new Array();
	paramKeys.push('branchcode');
	var paramElems=new Array();
	paramElems.push("#inputHospitalId");
	var selectize=initSelectizeRemote2($("#inputItemFilterIcd10"), 1, 'code', 'description', ['code','description'],  'code', true, ajaxGetImedIcd10Url,'estCostIcd10Change',paramKeys,paramElems,null, null, false);
	selectize=selectize[0].selectize;
	clearSelectize(selectize);
}
function estCostPyhSaveTemplateConfirm(){
	var passValidate=true;
	var templateName = $('#estCostPyhSaveTemplateModal #inputSaveTemplateName').val();
	templateName = $.trim(templateName);
	$('#estCostPyhSaveTemplateModal #inputSaveTemplateName').val(templateName);
	if(templateName==""){
    openModal('fail','กรุณาระบุชื่อ Template',false,null);
    passValidate=false;
	}

	if($("#inputHospitalId").val()==''){
    openModal('fail','กรุณาระบุโรงพยาบาล',false,null);
    passValidate=false;
	}

	passValidate = validateEstCostPyhTable() && passValidate;

	if(passValidate){
		$.ajax({
			type: 'POST',
			url: estCostPyhSaveTemplateUrl,
			data:  "inputHospitalId="+$("#inputHospitalId").val()+"&"+"inputBaseTariffId="+$("#inputBaseTariffId").val()+"&"+$('#estCostPyhSaveTemplateModalForm').serialize() + "&" + $('#form-table-est-cost').serialize(),
			dataType: "json",
			async:true,
      beforeSubmit:  function(){
        showPageLoading();
      },
			success: function(data) {
	      hidePageLoading();
        if(data.error!=""){
          openModal("fail",data.error,false,null);
        }
        else{
        	$('#estCostPyhSaveTemplateModal').modal('hide');
      		openModal("success","บันทึกสำเร็จ",false,null);
        }
			}
		});
	}
}
function estCostPyhSaveTemplate(){
	$('#estCostPyhSaveTemplateModal #inputSaveTemplateName').val('');
	$('#estCostPyhSaveTemplateModal').modal({ dynamic: true, backdrop: false });
	setTimeout(function(){
		$('#estCostPyhSaveTemplateModal').focus(); // add to fix bug on chrome when press esc
	},300);
}
function estCostPyhSaveCurrentTemplate(){
	if($("#inputItemFilterTemplate").val()==''){
		openModal("fail",'กรุณาเลือก Template',false,null);
		return;
	}

	var passValidate = true;
	passValidate = validateEstCostPyhTable() && passValidate;

	if(passValidate){
		var confirmText="ยืนยันบันทึก";
		openModal(confirmText,confirmText+"?",true,function(){
			var est_cost_template_id = $("#inputItemFilterTemplate").val();
			$.ajax({
				type: 'POST',
				url: estCostPyhSaveTemplateUrl,
				data:  "est_cost_template_id="+est_cost_template_id+"&"+"inputBaseTariffId="+$("#inputBaseTariffId").val()+"&"+$('#estCostPyhSaveTemplateModalForm').serialize() + "&" + $('#form-table-est-cost').serialize(),
				dataType: "json",
				async:true,
	      beforeSubmit:  function(){
	        showPageLoading();
	      },
				success: function(data) {
		      hidePageLoading();
	        if(data.error!=""){
	          openModal("fail",data.error,false,null);
	        }
	        else{
	      		openModal("success","บันทึกสำเร็จ",false,null);
	        }
				}
			});
		});
	}
}
function estCostPyhEditTemplateConfirm(){
	var passValidate=true;
	var templateName = $('#estCostPyhEditTemplateModal #inputEditTemplateName').val();
	templateName = $.trim(templateName);
	$('#estCostPyhEditTemplateModal #inputEditTemplateName').val(templateName);
	if(templateName==""){
    openModal('fail','กรุณาระบุชื่อ Template',false,null);
    passValidate=false;
	}

	if($("#inputHospitalId").val()==''){
    openModal('fail','กรุณาระบุโรงพยาบาล',false,null);
    passValidate=false;
	}

	if(passValidate){
		var est_cost_template_id = $("#inputItemFilterTemplate").val();
		$.ajax({
			type: 'POST',
			url: estCostPyhEditTemplateUrl,
			data:  "est_cost_template_id="+est_cost_template_id+"&inputHospitalId="+$("#inputHospitalId").val()+"&"+$('#estCostPyhEditTemplateModalForm').serialize(),
			dataType: "json",
			async:true,
      beforeSubmit:  function(){
        showPageLoading();
      },
			success: function(data) {
	      hidePageLoading();
        if(data.error!=""){
          openModal("fail",data.error,false,null);
        }
        else{
					var selectize = $("#inputItemFilterTemplate").get(0).selectize;
					clearSelectize(selectize);
					selectize.addOption({'est_cost_template_id':est_cost_template_id,'template_name':templateName});
					selectize.setValue(est_cost_template_id);

        	$('#estCostPyhEditTemplateModal').modal('hide');
      		openModal("success","บันทึกสำเร็จ",false,null);
        }
			}
		});
	}
}
function estCostPyhEditTemplate(){
	if($("#inputItemFilterTemplate").val()==''){
		openModal("fail",'กรุณาเลือก Template',false,null);
		return;
	}

	$('#estCostPyhEditTemplateModal #inputEditTemplateName').val('');
	$('#estCostPyhEditTemplateModal').modal({ dynamic: true, backdrop: false });
	setTimeout(function(){
		$('#estCostPyhEditTemplateModal').focus(); // add to fix bug on chrome when press esc
	},300);
}
function estCostPyhDeleteTemplate(){
	if($("#inputItemFilterTemplate").val()==''){
		openModal("fail",'กรุณาเลือก Template',false,null);
		return;
	}

	var passValidate = true;

	if(passValidate){
		var confirmText="ยืนยันลบ";
		openModal(confirmText,confirmText+"?",true,function(){
			var est_cost_template_id = $("#inputItemFilterTemplate").val();
			$.ajax({
				type: 'POST',
				url: estCostPyhDeleteTemplateUrl,
				data:  "est_cost_template_id="+est_cost_template_id,
				dataType: "json",
				async:true,
	      beforeSubmit:  function(){
	        showPageLoading();
	      },
				success: function(data) {
		      hidePageLoading();
	        if(data.error!=""){
	          openModal("fail",data.error,false,null);
	        }
	        else{
						var selectize = $("#inputItemFilterTemplate").get(0).selectize;
						clearSelectize(selectize);
	      		openModal("success","บันทึกสำเร็จ",false,null);
	        }
				}
			});
		});
	}
}
function estCostGetPatientNameByHn(){
	var hos_id="";
	var hn="";
	hos_id=$("#inputHospitalId").val();
	hn=$("#inputHN").val();
	hn=$.trim(hn);
	$("#inputHN").val(hn);
	if(hos_id!='' && hn!=''){
		$("#inputHN").closest('div').find("span.help-inline").html('กำลังค้นหา HN ในระบบ...');
		getPatientNameByHn(hos_id,hn,function(data){
		  if(data!=null){
		  	$("#inputHN").closest('div').find("span.help-inline").html('พบข้อมูล: '+data.firstname);

				var selectize = $("#inputTitleName").get(0).selectize;
				selectize.addOption({'value':data.prename,'text':data.prename});
				selectize.setValue(data.prename);

		  	$("#inputFirstName").val(data.firstname);
		  	$("#inputLastName").val(data.lastname);
		  	if(data.pid!=null){
		  		$("#inputPID").val(data.pid);
		  	}
		  	if(data.passport_no!=null){
		  		$("#inputPassportNo").val(data.passport_no);
		  	}
		  	if(data.age!=null){
		  		$("#inputAge").val(data.age);
		  	}

		  	if(data.fix_nationality_id!=null){
		  		refreshComboBox($("#inputNationalityId"),data.fix_nationality_id);
		  	}
		  }
		  else{
		  	$("#inputHN").closest('div').find("span.help-inline").html('ไม่พบข้อมูล');
		  }
		});
	}
}
function getPatientNameByHn(hos_id,hn,callback){
	$.ajax({
	  type: 'GET',
	  url: ajaxGetPatientNameByHNUrl,
	  data: {'hn': hn,'hos_id': hos_id},
	  success: function(data) {
	  	callback(data);
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
function openEstCostChooseItemModal(){
	$('#estCostChooseItemModal #inputSaveTemplateName').val('');
	$('#estCostChooseItemModal').modal({ dynamic: true, backdrop: false });
	setTimeout(function(){
		$('#estCostChooseItemModal').focus(); // add to fix bug on chrome when press esc
	},300);
}
function estCostPyhGetVisitDatatable(){
	bpkDataTableSearchSubmit2('est-cost-choose-visit-datatable');
}
if(viewName=="est_cost-pyh"){
	$(document).ready(function() {	
		initSelectizeLocal($("#inputBaseTariffId"), 1, 'base_tariff_id', 'description', ['description'], null, false);
		estCostTemplateInit();
		estCostChoosePatientInit();
		estCostChooseVisitInit();
		estCostIcd9Init();
		estCostIcd10Init();
		estCostFilterDoctorInit();
		estCostCurrentPatientInit();

		$("#inputHospitalId").change(function(){
			estCostBaseTariffInit($(this).val());

			var selectize = $("#inputItemFilterTemplate").get(0).selectize;
			clearSelectize(selectize);

			var selectize = $("#inputItemFilterIcd9").get(0).selectize;
			clearSelectize(selectize);

			var selectize = $("#inputItemFilterIcd10").get(0).selectize;
			clearSelectize(selectize);

			var selectize = $("#inputItemFilterDoctor").get(0).selectize;
			clearSelectize(selectize);

			var selectize = $("#inputItemFilterChoosePatient").get(0).selectize;
			clearSelectize(selectize);

			var selectize = $("#inputItemFilterChooseVisit").get(0).selectize;
			clearSelectize(selectize);

			var selectize = $("#inputEstCostCurrentPatient").get(0).selectize;
			clearSelectize(selectize);
		});

		estCostBaseTariffInit($("#inputHospitalId").val());

		$("#inputHN").keyup(function(){
			estCostGetPatientNameByHn();
		})
		$("#inputItemFilterIcd9, #inputItemFilterIcd10, #inputItemFilterDoctor").change(function(){
			var selectize = $("#inputItemFilterChoosePatient").get(0).selectize;
			clearSelectize(selectize);

			var selectize = $("#inputItemFilterChooseVisit").get(0).selectize;
			clearSelectize(selectize);
		});
		$("#inputItemFilterChoosePatient").change(function(){
			var selectize = $("#inputItemFilterChooseVisit").get(0).selectize;
			clearSelectize(selectize);
		});
		$("#inputHospitalId").change(function(){
			estCostPyhClear();
		});
		$("#inputBaseTariffId").change(function(event){
			estCostPyhOnChangeTariff($(this).val());
		});

		estCostPyhDataTable = $('#est-cost-pyh-datatable').DataTable({
      buttons: [
      	{
          extend: 'excelHtml5',
          title: 'ตารางประเมินค่าใช้จ่าย',
          exportOptions: {
            columns: [':not(.non-export)']
          }
        },
      ],
			"responsive": false,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.no;
					}
				},
	            { 	"mData" : null, "sClass": "center non-export",
					"mRender": function ( data, type, full ) {
						var html='<select class="form-control" style="width:300px;" name="inputEditItemId_'+full.no+'" ind="'+full.i+'">'
		                  +'<option value="">กรุณาเลือก</option>'
										+'</select>';
						html+='<input type="hidden" name="inputEditItemCode_'+full.no+'" ind="'+full.i+'">';
						html+='<input type="hidden" name="inputEditItemName_'+full.no+'" ind="'+full.i+'">';
						html+='<input type="hidden" name="inputEditItemCommonName_'+full.no+'" ind="'+full.i+'">';
						return html;
					}
				},
	            { 	"mData" : null, "sClass": "center non-export",
					"mRender": function ( data, type, full ) {
						var html='<select class="form-control" style="width:200px;" name="inputEditBillingGroup_'+full.no+'" ind="'+full.i+'">'
		                  +'<option value="">กรุณาเลือก</option>'
										+'</select>';
						return html;
					}
				},
	          { 	"mData" : null, "sClass": "left", "bVisible": false,
					"mRender": function ( data, type, full ) {
						return '<span name="spanItemName_'+full.no+'" ind="'+full.i+'">'+full.item_name+'</span>';
					}
				},
	          { 	"mData" : null, "sClass": "left", "bVisible": false,
					"mRender": function ( data, type, full ) {
						return '<span name="spanQty_'+full.no+'" ind="'+full.i+'">'+full.qty+'</span>';
					}
				},
	          { 	"mData" : null, "sClass": "left", "bVisible": false,
					"mRender": function ( data, type, full ) {
						return '<span name="spanUnit_'+full.no+'" ind="'+full.i+'">'+full.unit+'</span>';
					}
				},
	          { 	"mData" : null, "sClass": "left", "bVisible": false,
					"mRender": function ( data, type, full ) {
						return '<span name="spanPrice_'+full.no+'" ind="'+full.i+'">'+full.price+'</span>';
					}
				},
	          { 	"mData" : null, "sClass": "left", "bVisible": false,
					"mRender": function ( data, type, full ) {
						return '<span name="spanTotalPrice_'+full.no+'" ind="'+full.i+'">'+full.total_price+'</span>';
					}
				},
	            { 	"mData" : null, "sClass": "center non-export",
					"mRender": function ( data, type, full ) {
						var html='<input type="text" style="width:50px; text-align:right;" class="form-control pos-decimal" name="inputEditQty_'+full.no+'" ind="'+full.i+'">'
						return html;
					}
				},
	            { 	"mData" : null, "sClass": "center non-export",
					"mRender": function ( data, type, full ) {
						var html='<input type="text" style="width:50px;" class="form-control" name="inputEditUnit_'+full.no+'" ind="'+full.i+'">'
						return html;
					}
				},
	            { 	"mData" : null, "sClass": "right non-export",
					"mRender": function ( data, type, full ) {
						if(full.default_item_price==null) return '<span name="default_item_price" ind="'+full.i+'"></span>';
						return '<span name="default_item_price" ind="'+full.i+'">'+parseFloat(full.default_item_price).formatMoney(2,'.',',')+'</span>';
					}
				},
	            { 	"mData" : null, "sClass": "center non-export",
					"mRender": function ( data, type, full ) {
						var html='<input type="text" style="width:75px; text-align:right;" class="form-control pos-decimal" name="inputEditPrice_'+full.no+'" ind="'+full.i+'">'
						return html;
					}
				},
	            { 	"mData" : null, "sClass": "center non-export",
					"mRender": function ( data, type, full ) {
						var html='<input type="text" style="width:75px; text-align:right;" class="form-control pos-decimal" readonly name="inputEditTotalPrice_'+full.no+'" ind="'+full.i+'">'
						return html;
					}
				},
	          { 	"mData" : null, "sClass": "right", "bVisible": itemCostVisible,
					"mRender": function ( data, type, full ) {
						if(full.item_avg_cost==null) return '<span name="item_avg_cost" ind="'+full.i+'"></span>';
						return '<span name="item_avg_cost" ind="'+full.i+'">'+parseFloat(full.item_avg_cost).formatMoney(2,'.',',')+'</span>';
					}
				},
	          { 	"mData" : null, "sClass": "right", "bVisible": itemCostVisible,
					"mRender": function ( data, type, full ) {
						if(full.item_avg_cost==null) return '<span name="item_avg_cost_total" ind="'+full.i+'"></span>';
						return '<span name="item_avg_cost_total" ind="'+full.i+'">'+parseFloat(full.item_avg_cost * full.qty).formatMoney(2,'.',',')+'</span>';
					}
				},
	            { 	"mData" : null, "sClass": "center nowrap non-export",
					"mRender": function ( data, type, full ) {
						return '<button class="btn btn-primary btn-est-cost-pyh-table-add" onclick="addNewEstCostPyh('+full.i+',null);">เพิ่ม</button>'
						+'<button class="btn btn-danger btn-est-cost-pyh-table-remove" style="margin-left:3px;" onclick="deleteNewEstCostPyh('+full.i+'); return false;">ลบ</button>';
					}						
				}
				],
	        // "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": false,
			"aaData" : null,
			"bFilter": false,
			"bInfo": false,
			"sDom": 'lfrtip',
			"bSort": false,
			"bPaginate": false,
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings,false,true,null);
				initInputPosDecimalByElem($("#est-cost-pyh-datatable .pos-decimal"));
				initInputPosIntegerByElem($("#est-cost-pyh-datatable .pos-integer"));
				$('.combobox','#est-cost-pyh-datatable').combobox({highlighter: function(item){ return item; }});
				initEstCostPyhInput();
			  // $("#invoice-list-datatable").css('width','100%');
			},
			initComplete : function (oSettings) {
				$(oSettings.nTable).DataTable().buttons().container().append('<button class="btn btn-warning" onclick="estCostSortByBillingGroup(); return false;">เรียงตาม Billing Group</button>');
				$(oSettings.nTable).DataTable().buttons().container().css('margin-left','3px');
		    $(oSettings.nTable).DataTable().buttons().container()
		        .prependTo( '#est-cost-pyh-datatable_wrapper' );
			},
			'fixedHeader': true
		});

		var estCostCurrentVisitItemDataTable = $('#est-cost-current-visit-item-datatable').DataTable({
      buttons: [
      	{
          extend: 'excelHtml5',
          title: 'รายการปัจจุบัน',
          exportOptions: {
            columns: [':not(.non-export)']
          }
        },
      ],
			"responsive": false,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.no;
					}
				},
	            { 	"mData" : null, "sClass": "left non-export",
					"mRender": function ( data, type, full ) {
						return full.item_name;
					}
				},
	            { 	"mData" : null, "sClass": "left non-export",
					"mRender": function ( data, type, full ) {
						return full.billing_group_code;
					}
				},
	          { 	"mData" : null, "sClass": "left", "bVisible": false,
					"mRender": function ( data, type, full ) {
						return full.item_name;
					}
				},
	          { 	"mData" : null, "sClass": "left", "bVisible": false,
					"mRender": function ( data, type, full ) {
						return full.qty;
					}
				},
	          { 	"mData" : null, "sClass": "left", "bVisible": false,
					"mRender": function ( data, type, full ) {
						return full.unit;
					}
				},
	          { 	"mData" : null, "sClass": "left", "bVisible": false,
					"mRender": function ( data, type, full ) {
						return parseFloat(full.price).formatMoney(2,'.',',');
					}
				},
	          { 	"mData" : null, "sClass": "left", "bVisible": false,
					"mRender": function ( data, type, full ) {
						return parseFloat(full.total_price).formatMoney(2,'.',',');
					}
				},
	            { 	"mData" : null, "sClass": "center non-export",
					"mRender": function ( data, type, full ) {
						return full.qty;
					}
				},
	            { 	"mData" : null, "sClass": "center non-export",
					"mRender": function ( data, type, full ) {
						return full.unit;
					}
				},
	            { 	"mData" : null, "sClass": "right non-export",
					"mRender": function ( data, type, full ) {
						return parseFloat(full.price).formatMoney(2,'.',',');
					}
				},
	            { 	"mData" : null, "sClass": "center non-export",
					"mRender": function ( data, type, full ) {
						return parseFloat(full.price).formatMoney(2,'.',',');
					}
				},
	            { 	"mData" : null, "sClass": "center non-export",
					"mRender": function ( data, type, full ) {
						return parseFloat(full.total_price).formatMoney(2,'.',',');
					}
				},
	          { 	"mData" : null, "sClass": "right", "bVisible": itemCostVisible,
					"mRender": function ( data, type, full ) {
						if(full.item_avg_cost==null) return '<span name="item_avg_cost" ind="'+full.i+'"></span>';
						return '<span name="item_avg_cost" ind="'+full.i+'">'+parseFloat(full.item_avg_cost).formatMoney(2,'.',',')+'</span>';
					}
				},
	          { 	"mData" : null, "sClass": "right", "bVisible": itemCostVisible,
					"mRender": function ( data, type, full ) {
						if(full.item_avg_cost==null) return '<span name="item_avg_cost_total" ind="'+full.i+'"></span>';
						return '<span name="item_avg_cost_total" ind="'+full.i+'">'+parseFloat(full.item_avg_cost * full.qty).formatMoney(2,'.',',')+'</span>';
					}
				}
				],
	        // "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": false,
			"aaData" : null,
			"bFilter": false,
			"bInfo": false,
			"sDom": 'lfrtip',
			"bSort": false,
			"bPaginate": false,
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings,false,true,null);
				initInputPosDecimalByElem($("#est-cost-current-visit-item-datatable .pos-decimal"));
				initInputPosIntegerByElem($("#est-cost-current-visit-item-datatable .pos-integer"));
				$('.combobox','#est-cost-current-visit-item-datatable').combobox({highlighter: function(item){ return item; }});
			  // $("#invoice-list-datatable").css('width','100%');
			},
			initComplete : function (oSettings) {
				// $(oSettings.nTable).DataTable().buttons().container().append('<button class="btn btn-warning" onclick="estCostCurrentVisitItemSortByBillingGroup(); return false;">เรียงตาม Billing Group</button>');
				$(oSettings.nTable).DataTable().buttons().container().css('margin-left','3px');
		    $(oSettings.nTable).DataTable().buttons().container()
		        .prependTo( '#est-cost-current-visit-item-datatable_wrapper' );
			},
			'fixedHeader': true
		});


		var onDTCheckboxChangeFunctionChooseItem=function(){
			var total=0;
			var countChoose=0;
			var dataTable=$("#choose-item-modal-datatable");
			var nodes =  dataTable.dataTable().fnGetNodes();
			$('.dt-checkbox', nodes).not('.disabled').each(function(){
				var ind=$(this).val();
				if($(this).is(":checked")){
					estCostChooseItemList[ind].is_checked = 'T';
				}
				else{
					estCostChooseItemList[ind].is_checked = 'F';
				}
			});
		};

		var estCostPyhChooseItemDataTable = $('#choose-item-modal-datatable').DataTable({
      buttons: [
      	{
          extend: 'excelHtml5',
          title: 'Item List',
          exportOptions: {
            columns: [':not(.non-export)']
          }
        },
      ],
			"responsive": false,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<input type="checkbox" name="inputDTCheckbox[]" class="dt-checkbox" value="'+full.i+'"/>';
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.no;
					}
				},
	            { 	"mData" : null, "sClass": "center non-export",
					"mRender": function ( data, type, full ) {
						var html='<select class="form-control" style="width:300px;" name="inputEditItemId_'+full.no+'" ind="'+full.i+'">'
		                  +'<option value="">กรุณาเลือก</option>'
										+'</select>';
						html+='<input type="hidden" name="inputEditItemCode_'+full.no+'" ind="'+full.i+'">';
						html+='<input type="hidden" name="inputEditItemName_'+full.no+'" ind="'+full.i+'">';
						html+='<input type="hidden" name="inputEditItemCommonName_'+full.no+'" ind="'+full.i+'">';
						return html;
					}
				},
	            { 	"mData" : null, "sClass": "center non-export",
					"mRender": function ( data, type, full ) {
						var html='<select class="form-control" style="width:200px;" name="inputEditBillingGroup_'+full.no+'" ind="'+full.i+'">'
		                  +'<option value="">กรุณาเลือก</option>'
										+'</select>';
						return html;
					}
				},
	          { 	"mData" : null, "sClass": "left", "bVisible": false,
					"mRender": function ( data, type, full ) {
						return '<span name="spanItemName_'+full.no+'" ind="'+full.i+'">'+full.item_name+'</span>';
					}
				},
	          { 	"mData" : null, "sClass": "left", "bVisible": false,
					"mRender": function ( data, type, full ) {
						return '<span name="spanQty_'+full.no+'" ind="'+full.i+'">'+full.qty+'</span>';
					}
				},
	          { 	"mData" : null, "sClass": "left", "bVisible": false,
					"mRender": function ( data, type, full ) {
						return '<span name="spanUnit_'+full.no+'" ind="'+full.i+'">'+full.unit+'</span>';
					}
				},
	          { 	"mData" : null, "sClass": "left", "bVisible": false,
					"mRender": function ( data, type, full ) {
						return '<span name="spanPrice_'+full.no+'" ind="'+full.i+'">'+full.price+'</span>';
					}
				},
	          { 	"mData" : null, "sClass": "left", "bVisible": false,
					"mRender": function ( data, type, full ) {
						return '<span name="spanTotalPrice_'+full.no+'" ind="'+full.i+'">'+full.total_price+'</span>';
					}
				},
	            { 	"mData" : null, "sClass": "center non-export",
					"mRender": function ( data, type, full ) {
						var html='<input type="text" style="width:50px; text-align:right;" class="form-control pos-decimal" name="inputEditQty_'+full.no+'" ind="'+full.i+'">'
						return html;
					}
				},
	            { 	"mData" : null, "sClass": "center non-export",
					"mRender": function ( data, type, full ) {
						var html='<input type="text" style="width:50px;" class="form-control" name="inputEditUnit_'+full.no+'" ind="'+full.i+'">'
						return html;
					}
				},
	            { 	"mData" : null, "sClass": "right non-export",
					"mRender": function ( data, type, full ) {
						if(full.default_item_price==null) return '<span name="default_item_price" ind="'+full.i+'"></span>';
						return '<span name="default_item_price" ind="'+full.i+'">'+parseFloat(full.default_item_price).formatMoney(2,'.',',')+'</span>';
					}
				},
	            { 	"mData" : null, "sClass": "center non-export",
					"mRender": function ( data, type, full ) {
						var html='<input type="text" style="width:75px; text-align:right;" class="form-control pos-decimal" name="inputEditPrice_'+full.no+'" ind="'+full.i+'">'
						return html;
					}
				},
	            { 	"mData" : null, "sClass": "center non-export",
					"mRender": function ( data, type, full ) {
						var html='<input type="text" style="width:75px; text-align:right;" class="form-control pos-decimal" readonly name="inputEditTotalPrice_'+full.no+'" ind="'+full.i+'">'
						return html;
					}
				},
	          { 	"mData" : null, "sClass": "right", "bVisible": itemCostVisible,
					"mRender": function ( data, type, full ) {
						if(full.item_avg_cost==null) return '<span name="item_avg_cost" ind="'+full.i+'"></span>';
						return '<span name="item_avg_cost" ind="'+full.i+'">'+parseFloat(full.item_avg_cost).formatMoney(2,'.',',')+'</span>';
					}
				},
	          { 	"mData" : null, "sClass": "right", "bVisible": itemCostVisible,
					"mRender": function ( data, type, full ) {
						if(full.item_avg_cost==null) return '<span name="item_avg_cost_total" ind="'+full.i+'"></span>';
						return '<span name="item_avg_cost_total" ind="'+full.i+'">'+parseFloat(full.item_avg_cost * full.qty).formatMoney(2,'.',',')+'</span>';
					}
				},
	            { 	"mData" : null, "sClass": "center nowrap non-export",
					"mRender": function ( data, type, full ) {
						return '<button class="btn btn-primary btn-est-cost-choose-item-add" onclick="addNewEstCostChooseItem('+full.i+',null); return false;">เพิ่ม</button>'
						+'<button class="btn btn-danger btn-est-cost-choose-item-remove" style="margin-left:3px;" onclick="deleteNewEstCostChooseItem('+full.i+'); return false;">ลบ</button>';
					}						
				}
				],
	        // "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": false,
			"aaData" : null,
			"bFilter": false,
			"bInfo": false,
			"sDom": 'lfrtip',
			"bSort": false,
			"bPaginate": false,
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings,false,true,null);
				initInputPosDecimalByElem($("#choose-item-modal-datatable .pos-decimal"));
				initInputPosIntegerByElem($("#choose-item-modal-datatable .pos-integer"));
				$('.combobox','#choose-item-modal-datatable').combobox({highlighter: function(item){ return item; }});
				initEstCostChooseItemInput();
				setTimeout(function(){
					initDTCheckbox('choose-item-modal-datatable',onDTCheckboxChangeFunctionChooseItem);
				},500);
			  // $("#invoice-list-datatable").css('width','100%');
			},
			initComplete : function (oSettings) {
				$(oSettings.nTable).DataTable().buttons().container().append('<button class="btn btn-warning" onclick="estCostChooseItemSortByBillingGroup(); return false;">เรียงตาม Billing Group</button>');
				$(oSettings.nTable).DataTable().buttons().container().css('margin-left','3px');
		    $(oSettings.nTable).DataTable().buttons().container()
		        .prependTo( '#choose-item-modal-datatable_wrapper' );
			},
			'fixedHeader': false
		});

		var estCostSummaryItemDataTable = $('#est-cost-summary-item-datatable').DataTable({
      buttons: [
      	{
          extend: 'excelHtml5',
          title: 'Summary',
          exportOptions: {
            columns: [':not(.non-export)']
          }
        },
      ],
			"responsive": false,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.no;
					}
				},
	            { 	"mData" : null, "sClass": "left",
					"mRender": function ( data, type, full ) {
						return full.billing_group_code;
					}
				},
	            { 	"mData" : null, "sClass": "left",
					"mRender": function ( data, type, full ) {
						return full.billing_group_desc;
					}
				},
	          { 	"mData" : null, "sClass": "right",
					"mRender": function ( data, type, full ) {
						return parseFloat(full.total_price).formatMoney(2,'.',',');
					}
				}
				],
	        // "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": false,
			"aaData" : null,
			"bFilter": false,
			"bInfo": false,
			"sDom": 'lfrtip',
			"bSort": false,
			"bPaginate": false,
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings,false,true,null);
				initInputPosDecimalByElem($("#est-cost-summary-item-datatable .pos-decimal"));
				initInputPosIntegerByElem($("#est-cost-summary-item-datatable .pos-integer"));
				$('.combobox','#est-cost-summary-item-datatable').combobox({highlighter: function(item){ return item; }});
			  // $("#invoice-list-datatable").css('width','100%');
			},
			initComplete : function (oSettings) {
				// $(oSettings.nTable).DataTable().buttons().container().append('<button class="btn btn-warning" onclick="estCostSummaryItemSortByBillingGroup(); return false;">เรียงตาม Billing Group</button>');
				$(oSettings.nTable).DataTable().buttons().container().css('margin-left','3px');
		    $(oSettings.nTable).DataTable().buttons().container()
		        .prependTo( '#est-cost-summary-item-datatable_wrapper' );
			},
			'fixedHeader': true
		});

		var estCostChooseVisitDataTable = $('#est-cost-choose-visit-datatable').DataTable({
			"responsive": false,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
        { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.hn;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.vn;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.an;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.visit_date;
					}
				},
	            { 	"mData" : null, "sClass": "left",
					"mRender": function ( data, type, full ) {
						return full.patient_name;
					}
				},
	            { 	"mData" : null, "sClass": "left",
					"mRender": function ( data, type, full ) {
						return full.doctor_name;
					}
				},
	            { 	"mData" : null, "sClass": "left",
					"mRender": function ( data, type, full ) {
						return full.icd9_desc;
					}
				},
	            { 	"mData" : null, "sClass": "left",
					"mRender": function ( data, type, full ) {
						return full.icd10_desc;
					}
				},
	          { 	"mData" : null, "sClass": "right",
					"mRender": function ( data, type, full ) {
						return parseFloat(full.total_price).formatMoney(2,'.',',');
					}
				},
	      {   "mData" : null, "sClass": "center",
	        "mRender": function ( data, type, full ) {
						return '<button style="width:75px;" onclick="estCostPyhGetItemByVisit(\''+full.visit_id+'\'); return false;" class="btn btn-primary">ดึงข้อมูล</button>';
	        }
	      }
				],
	    "aaSorting": [[ 4, "desc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": estCostChooseVisitDatatableUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
	      aoData.push( { "name": "branchcode", "value": $("#inputHospitalId").val() } );
	      aoData.push( { "name": "patient_id", "value": $("#inputItemFilterChoosePatient").val() } );
	      aoData.push( { "name": "icd9_code", "value": $("#inputItemFilterIcd9").val() } );
	      aoData.push( { "name": "icd10_code", "value": $("#inputItemFilterIcd10").val() } );
	      aoData.push( { "name": "doctor_eid", "value": $("#inputItemFilterDoctor").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			},
			'fixedHeader': true
		});

		openEstCostPyh();
	});
}


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
	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputHN]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputLastName]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputFirstName]")) && passValidate;

	if(passValidate){
		$("#estCostForm").submit();
	}
}
function validateEstCostEditForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputHN]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputLastName]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputFirstName]")) && passValidate;

	if(passValidate){
		$("#estCostForm").submit();
	}
}
if(viewName=="est_cost-add" || viewName=="est_cost-edit"){

	$("#inputHN").keyup(function (){
		var hn=$(this).val();
		if((hn.length==1 || hn.length==4) && hn.length>oldCheckHn.length){
			hn+="-";
			$(this).val(hn);
		}

		// if(oldCheckHn!=hn){
		// 	if(hn.length==11){
		// 		getPatientNameByHn(hn);
		// 	}
		// 	else{
		//   	$("#div-inputHN span.help-inline").html('');
		// 	}
		// }
		oldCheckHn=hn;
	});

	$("#inputTitleName").change(function(){
		if($(this).val()=="other"){
			$("#inputTitleNameOther").closest('div.form-group').show();
		}
		else{
			$("#inputTitleNameOther").closest('div.form-group').hide();
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
		bpkDataTable=$('#est_cost-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
						return '<span class="label label-danger">ไม่ยินยอม</span>';
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
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

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
		bpkDataTable=$('#doc_command-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
		bpkDataTable=$('#doc_notice-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
		bpkDataTable=$('#doc_note-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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


//quality-kpi
function showQualityKpi2(quality_indicator_id){
	$('#viewModal').modal({ dynamic: true, backdrop: 'static',keyboard: false });
	
	$.ajax({
	  type: 'POST',
	  url: ajaxGetQualityKpi2Url,
	  data: {"quality_indicator_id":quality_indicator_id,"section_id":"0"},
	  success: function(result) {
	  	var unit=result.unit;
	  	var data=result.data;
	  	var hosText="";
	  	if(userHosId=='7'){
	  		hosText="Piyavate";
	  	}
	  	else{
	  		hosText="Bangpakok 9 Hospital";	  		
	  	}
	  	$("#def-table").html(result.def_table);
	  	$("#actual-table").html(result.actual_table);
	  	$("#note-all-result").html('quality_indicator_id:'+result.quality_indicator_id+' section_id: '+result.section_id);
	  	// $("#analysis_text").html(result.analysis_text);
	  	$('#BPK9_result').highcharts({
	      title:{
					text:result.indicator_name+'<br/>('+hosText+')'
				},
				subtitle:{
					text: result.analysis_text,
					useHTML: true,
					align: 'left'
				},
				xAxis: {
		            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
		                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		        },
		    yAxis:{
		    	title:{text:'<b>'+unit+'</b>'},
		    	gridLineColor:'transparent',
		    	/*plotBands: [{
		    		color: '#99ffcc',
		    		from: result.LCL_BPK9_value+",to:"+result.UCL_BPK9_value
		    	}]*/
		    	plotBands: [{
		    		color: '#99ffcc',
		    		from: result.LCL_BPK9_value,
		    		to: result.UCL_BPK9_value
		    	}]
		    },
				tooltip: {
					useHTML: true,
					formatter: function() {
						return '<b>Month</b>: '+this.x+'<br/><b>Actual: </b>'+this.y+'<br/>n/N : '+this.point.numerator+' / '+this.point.denominator+'<br/>comment: '+this.point.comment;
					}
				},
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            borderWidth: 0
        },
				series: data
    	});    	
		},
	  dataType: "json",
	  async:false
	});

	$.ajax({
	  type: 'POST',
	  url: ajaxGetQualityKpi2Url,
	  data: {"quality_indicator_id":quality_indicator_id,"section_id":userSectionId},
	  success: function(result) {
	  	if(result.display_graph=='0'){
	  		$("#actual-section-table").html('');
	  		$("#note-section-result").html('');
	  		$("#user_section_result").hide();
	  		return;
	  	}
	  	
	  	$("#user_section_result").show();
	  	var unit=result.unit;
	  	var data=result.data;
	  	$("#actual-section-table").html(result.actual_table);
	  	$("#note-section-result").html('quality_indicator_id:'+result.quality_indicator_id+' section_id: '+result.section_id);
	  	$('#user_section_result').highcharts({
	      title:{
					text:result.indicator_name+'<br/>'+'('+userSectionName+')'
				},
				subtitle:{
					text: result.analysis_text,
					useHTML: true,
					align: 'left'
				},
				xAxis: {
		            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
		                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		        },
		    yAxis:{
		    	title:{text:'<b>'+unit+'</b>'},
		    	gridLineColor:'transparent',
		    	/*plotBands: [{
		    		color: '#99ffcc',
		    		from: result.LCL_BPK9_value+",to:"+result.UCL_BPK9_value
		    	}]*/		    	
		    	plotBands: [{
		    		color: '#99ffcc',
		    		from: result.LCL_BPK9_value,
		    		to: result.UCL_BPK9_value
		    	}]
		    },
				tooltip: {
					useHTML: true,
					formatter: function() {
						return '<b>Month</b>: '+this.x+'<br/><b>Actual: </b>'+this.y+'<br/>n/N : '+this.point.numerator+' / '+this.point.denominator+'<br/>comment: '+this.point.comment;
					}
				},
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            borderWidth: 0
        },
				series: data
	  	});    	
		},
	  dataType: "json",
	  async:false
	});
}
function showQualityKpi(quality_indicator_id){
	$('#viewModal').modal({ dynamic: true, backdrop: 'static',keyboard: false });
	
	$.ajax({
	  type: 'POST',
	  url: ajaxGetQualityKpiUrl,
	  data: {"quality_indicator_id":quality_indicator_id,"section_id":"0"},
	  success: function(data) {
	  	var hosText="";
	  	if(userHosId=='7'){
	  		hosText="Piyavate";
	  	}
	  	else{
	  		hosText="Bangpakok 9 Hospital";	  		
	  	}
	  	$('#BPK9_result').highcharts({
	      title:{
					text:hosText
				},
				xAxis: {
		            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
		                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		        },
				tooltip: {
					formatter: function() {
						return 'The value for <b>' + this.x + '</b> is <b>' + this.y + '</b>, in series '+ this.series.name;
					}
				},
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
				series: data
    	});    	
		},
	  dataType: "json",
	  async:false
	});

	$.ajax({
	  type: 'POST',
	  url: ajaxGetQualityKpiUrl,
	  data: {"quality_indicator_id":quality_indicator_id,"section_id":userSectionId},
	  success: function(data) {
	  	$('#user_section_result').highcharts({
	  		title:{
	  			text: 'Your Department'
	  		},
	  		xAxis: {
	  			categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
	  			'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	  		},
	  		legend: {
	  			layout: 'vertical',
	  			align: 'right',
	  			verticalAlign: 'middle',
	  			borderWidth: 0
	  		},
	  		series: data
	  	});    	
		},
	  dataType: "json",
	  async:false
	});
}
if(viewName=="quality-kpi"){
	$(function(){
		bpkDataTable=$('#report-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "left" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
			      return '<a href="#" onclick="showQualityKpi2(\''+full.quality_indicator_id+'\'); return false;"><span>'+full.name+'</span></a>';
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.KPI=='1'){
							return '<i class="glyphicon glyphicon-ok"></i>';
						}
						else{
							return '<i class="glyphicon glyphicon-remove"></i>';
						}
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						/*if(full.achieve==null) return '';
						else if(full.achieve=='1'){
							return '<i class="glyphicon glyphicon-ok"></i>';
						}
						else{
							return '<i class="glyphicon glyphicon-remove"></i>';
						}*/
						if(full.achieve=='1'){
							return '<i class="glyphicon glyphicon-ok"></i>';
						}
						else{
							return '<i class="glyphicon glyphicon-remove"></i>';
						}
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.PYH=='1'){
							return '<i class="glyphicon glyphicon-ok"></i>';
						}
						else{
							return '<i class="glyphicon glyphicon-remove"></i>';
						}
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.QPS=='1'){
							return '<i class="glyphicon glyphicon-ok"></i>';
						}
						else{
							return '<i class="glyphicon glyphicon-remove"></i>';
						}
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.CPG=='1'){
							return '<i class="glyphicon glyphicon-ok"></i>';
						}
						else{
							return '<i class="glyphicon glyphicon-remove"></i>';
						}
					}
				},
	            { 	"mData" : null, "sClass": "left",
					"mRender": function ( data, type, full ) {
						return full.JCI
					}
				}
	        ],
	        "aaSorting": [[ 2, "desc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
			   //    aoData.push( { "name": "ior_name", "value": $("#inputIorName").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);

				var table=$('#report-datatable').DataTable();
				var body = $( table.table().body() );
 
        body.unhighlight();
        body.highlight( table.search() );  
			},
			"iDisplayLength": 50,
		});

		$("#table-report-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	});
}
//end quality-kpi


//quality-quiz
function updateQualityQuizSummary(quality_quiz_topic_id){
	$('#check_compliance_table').dataTable().fnClearTable();

	$.ajax({
	  type: 'POST',
	  url: ajaxGetQualityQuizSummaryUrl,
	  data: {"quality_quiz_topic_id":quality_quiz_topic_id,"section_id":userSectionId},
	  success: function(data) {
	  	if(data.length>0){
		  	$('#check_compliance_table').dataTable().fnAddData(data);
			}
		},
	  dataType: "json",
	  async:false
	});
}
function showQualityQuiz(quality_quiz_topic_id){
	selected_quality_quiz_topic_id=quality_quiz_topic_id;
	$('#viewModal').modal({ dynamic: true, backdrop: 'static',keyboard: false });

	updateQualityQuizSummary(quality_quiz_topic_id);

	$.ajax({
	  type: 'POST',
	  url: ajaxGetQualityQuizQuestionUrl,
	  data: {"quality_quiz_topic_id":quality_quiz_topic_id,"section_id":userSectionId},
	  success: function(data) {
	  	$("#form-quiz-question").html('');
	  	for(var i = 0 ; i < data.length ; i++){
	  		var newHtml='<div style="padding:10px;margin:10px;box-shadow: 5px 5px 5px;">'
	  		newHtml+='<h4>'+(i+1)+'. '+data[i].quiz_text+'</h4>';
	  		newHtml+=data[i].option_syntax;
	  		newHtml+='<h4 style="border:solid;padding:5px;display:none" id="quiz_'+data[i].quiz_id+'_comment">'+data[i].correct_text+'</h4>';
	  		newHtml+='<p style="padding:5px;display:none;color:blue" id="quiz_'+data[i].quiz_id+'_accept">ระบบได้บันทึกการตอบคำถามข้อนี้ของท่านแล้ว ขอบคุณครับ</p>';
				newHtml+='</div>';
	  		$("#form-quiz-question").append(newHtml);
	  		initQuizChoice();
	  	}
		},
	  dataType: "json",
	  async:false
	});
}
function initQuizChoice(){
	$(".quiz_choice").click(function(){
		var quality_quiz_topic_id = selected_quality_quiz_topic_id;
		var this_quiz_id = $(this).attr("quiz_id");
		var correct_option = $(this).attr("correct_option");
		var this_value = $(this).val();
		var this_quiz_comment_dom = '#quiz_'+this_quiz_id+'_comment';
		var this_quiz_comment_accept = '#quiz_'+this_quiz_id+'_accept';
		if(correct_option == this_value){
			$(this_quiz_comment_dom).removeClass().addClass("glyphicon glyphicon-ok").css("color","green");
		} else {
			$(this_quiz_comment_dom).removeClass().addClass("glyphicon glyphicon-remove").css("color","red");
		}
		$(this_quiz_comment_dom).show();
		$(this_quiz_comment_accept).show();
		$.ajax({ 
			type: "POST", 
			url: ajaxGetQualityQuizSubmitUrl, 
			cache: false, 
			data: "answer_value="+this_value+"&emp_id="+userEmpId+"&quiz_id="+this_quiz_id+"&quality_quiz_topic_id="+quality_quiz_topic_id,
			success: function(msg){ 
				$("#quiz_summary_div").html("").html(msg); 
				updateQualityQuizSummary(quality_quiz_topic_id);
			} 
		}); 
	});
}
if(viewName=="quality-quiz"){
	$(function(){
		bpkDataTable=$('#report-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "left" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
			      return '<a href="#" onclick="showQualityQuiz(\''+full.quality_quiz_topic_id+'\'); return false;"><span>'+full.name+'</span></a>';
					}
				},
	            { 	"mData" : null, "sClass": "left",
					"mRender": function ( data, type, full ) {
						return full.count_row;
					}
				}
	        ],
	        "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
			   //    aoData.push( { "name": "ior_name", "value": $("#inputIorName").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);

				var table=$('#report-datatable').DataTable();
				var body = $( table.table().body() );
 
        body.unhighlight();
        body.highlight( table.search() );  
			}
		});

		$("#table-report-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});


		$('#check_compliance_table').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "left",
					"mRender": function ( data, type, full ) {
						return full.emp_name;
					}
				},
	            { 	"mData" : null, "sClass": "right",
					"mRender": function ( data, type, full ) {
						return (full.answer_amount/full.quiz_amount*100);
					}
				}
				],
	        // "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": false,
			"aaData" : null,
			"bFilter": false,
			"bInfo": false,
			"bPaginate": false,
			"sDom": 'lfrtip',
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings,false,true,null);
				// $(".pos-decimal",$('#check_compliance_table')).numeric({ decimal:".", negative : false });	
			  // $("#invoice-list-datatable").css('width','100%');
			}
		});
	});
}
//end quality-quiz


//quality-abbr
if(viewName=="quality-abbr"){
	$(function(){
		bpkDataTable=$('#report-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "left" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.abbr;
					}
				},
	            { 	"mData" : null, "sClass": "left",
					"mRender": function ( data, type, full ) {
						return full.definition;
					}
				}
	        ],
	        "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
			   //    aoData.push( { "name": "ior_name", "value": $("#inputIorName").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);

				var table=$('#report-datatable').DataTable();
				var body = $( table.table().body() );
 
        body.unhighlight();
        body.highlight( table.search() );  
			}
		});

		$("#table-report-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	});
}
//end quality-abbr


//quality-cqi
if(viewName=="quality-cqi"){
	$(function(){
		bpkDataTable=$('#report-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "left" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+newsViewUrl+'/'+full.news_id+'">'+full.news_name+'</a>';
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.project_year;
					}
				}
	        ],
	        "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
			   //    aoData.push( { "name": "ior_name", "value": $("#inputIorName").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);

				var table=$('#report-datatable').DataTable();
				var body = $( table.table().body() );
 
        body.unhighlight();
        body.highlight( table.search() );  
			}
		});

		$("#table-report-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	});
}
//end quality-cqi


//quality-cmt
function showQualityKpiCmt(quality_cmt_id){
	selected_quality_cmt_id=quality_cmt_id;
	bpkDataTableSearchSubmit($('#report2-datatable').DataTable());
}
function showQualityKpiCmtGraph(quality_indicator_id){
	$('#viewModal').modal({ dynamic: true, backdrop: 'static',keyboard: false });
	
	$.ajax({
	  type: 'POST',
	  url: ajaxGetQualityKpi2Url,
	  data: {"quality_indicator_id":quality_indicator_id,"section_id":"0"},
	  success: function(result) {
	  	var unit=result.unit;
	  	var data=result.data;
	  	var hosText="";
	  	if(userHosId=='7'){
	  		hosText="Piyavate";
	  	}
	  	else{
	  		hosText="Bangpakok 9 Hospital";	  		
	  	}
	  	$("#def-table").html(result.def_table);
	  	$("#actual-table").html(result.actual_table);
	  	$("#note-all-result").html('quality_indicator_id:'+result.quality_indicator_id+' section_id: '+result.section_id);
	  	// $("#analysis_text").html(result.analysis_text);
	  	$('#BPK9_result').highcharts({
	      title:{
					text:result.indicator_name+'<br/>('+hosText+')'
				},
				subtitle:{
					text: result.analysis_text,
					useHTML: true,
					align: 'left'
				},
				xAxis: {
		            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
		                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		        },
		    yAxis:{
		    	title:{text:'<b>'+unit+'</b>'},
		    	gridLineColor:'transparent',
		    	/*plotBands: [{
		    		color: '#99ffcc',
		    		from: result.LCL_BPK9_value+",to:"+result.UCL_BPK9_value
		    	}]*/
		    	plotBands: [{
		    		color: '#99ffcc',
		    		from: result.LCL_BPK9_value,
		    		to: result.UCL_BPK9_value
		    	}]
		    },
				tooltip: {
					useHTML: true,
					formatter: function() {
						return '<b>Month</b>: '+this.x+'<br/><b>Actual: </b>'+this.y+'<br/>n/N : '+this.point.numerator+' / '+this.point.denominator+'<br/>comment: '+this.point.comment;
					}
				},
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            borderWidth: 0
        },
				series: data
    	});    	
		},
	  dataType: "json",
	  async:false
	});
}
if(viewName=="quality-cmt"){
	$(function(){
		bpkDataTable=$('#report-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="showQualityKpiCmt(\''+full.quality_cmt_id+'\'); return false;">'+full.name+'</a>';
					}
				}
	        ],
	        "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
			   //    aoData.push( { "name": "ior_name", "value": $("#inputIorName").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);

				var table=$('#report-datatable').DataTable();
				var body = $( table.table().body() );
 
        body.unhighlight();
        body.highlight( table.search() );  
			}
		});

		$("#table-report-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});

		/////list kpi
		$('#report2-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
			      return '<a href="#" onclick="showQualityKpiCmtGraph(\''+full.quality_indicator_id+'\'); return false;"><span>'+full.name+'</span></a>';
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.KPI=='1'){
							return '<i class="glyphicon glyphicon-ok"></i>';
						}
						else{
							return '<i class="glyphicon glyphicon-remove"></i>';
						}
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.achieve==null) return '';
						else if(full.achieve=='1'){
							return '<i class="glyphicon glyphicon-ok"></i>';
						}
						else{
							return '<i class="glyphicon glyphicon-remove"></i>';
						}
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.PYH=='1'){
							return '<i class="glyphicon glyphicon-ok"></i>';
						}
						else{
							return '<i class="glyphicon glyphicon-remove"></i>';
						}
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.QPS=='1'){
							return '<i class="glyphicon glyphicon-ok"></i>';
						}
						else{
							return '<i class="glyphicon glyphicon-remove"></i>';
						}
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.CPG=='1'){
							return '<i class="glyphicon glyphicon-ok"></i>';
						}
						else{
							return '<i class="glyphicon glyphicon-remove"></i>';
						}
					}
				},
	            { 	"mData" : null, "sClass": "left",
					"mRender": function ( data, type, full ) {
						return full.JCI
					}
				}
	        ],
	        "aaSorting": [[ 2, "desc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl_kpi_cmt,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
			      aoData.push( { "name": "quality_cmt_id", "value": selected_quality_cmt_id } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);

				var table=$('#report2-datatable').DataTable();
				var body = $( table.table().body() );
 
        body.unhighlight();
        body.highlight( table.search() );  
			}
		});
	});
}
//end quality-cmt


//quality-policy
if(viewName=="quality-policy"){
	$(function(){
		bpkDataTable=$('#report-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "left" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+newsViewUrl+'/'+full.news_id+'">'+full.news_name+'</a>';
					}
				}
	        ],
	        "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
			   //    aoData.push( { "name": "ior_name", "value": $("#inputIorName").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);

				var table=$('#report-datatable').DataTable();
				var body = $( table.table().body() );
 
        body.unhighlight();
        body.highlight( table.search() );  
			}
		});

		$("#table-report-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	});
}
//end quality-policy


//deposit-view
function depositCardCheckFormClear(){
	var form = $("#form-deposit-check");
	$("#inputCardId",form).val('');
	$("#infoCardIdDisplay",form).val('');
	$("#infoCardIdDisplay",form).show();
	$("#infoCardIdError",form).text('');
	$("#infoCardIdError",form).hide();
	$("#infoCardRole",form).text('');
	$("#infoCardRole",form).hide();
	$("#inputCardName",form).val('');
	$("#infoCardType",form).val('');
	$("#infoStartDate",form).text('-');
	$("#infoExpireDate",form).text('-');
	$("#inputCardCurrentValue",form).val('');
}
function depositGetData(card_id){
	depositCardCheckFormClear();
	var form = $("#form-deposit-check");
	$.ajax({
		type: 'GET',
		url: couponApiBaseUrl+'/card/get_deposit',
		data:  {'card_id':card_id},
		dataType: "json",
		async:true,
    beforeSubmit:  function(){
      showPageLoading();
    },
		success: function(data) {
      hidePageLoading();      
      var card_data = data.data.card_data;
      var parent_card_data = data.data.parent_card_data;
      if(card_data==null){
      	$("#infoCardIdError",form).text('ไม่พบข้อมูลบัตร');
      	$("#infoCardIdDisplay",form).hide();
      	$("#infoCardIdError",form).show();
      }
      else{
      	$("#infoCardIdDisplay",form).show();
      	$("#infoCardIdError",form).hide();
      	$("#infoCardIdDisplay",form).val(card_data.card_id_display);
				$("#infoCardRole",form).text(card_data.card_role);
				$("#infoCardRole",form).show();
				$("#inputCardName",form).val(card_data.card_name);
				$("#infoCardType",form).val(card_data.card_type_name);
				$("#infoStartDate",form).text(card_data.start_date==null?'':card_data.start_date.substring(0,10));
				$("#infoExpireDate",form).text(card_data.expire_date==null?'':card_data.expire_date.substring(0,10));
				if(parent_card_data!=null){
					card_data.current_value = parent_card_data.current_value;
				}
				$("#inputCardCurrentValue",form).val(parseFloat(card_data.current_value).formatMoney(2,'.',','));
				if(card_data.current_value==null || isNaN(card_data.current_value) || parseFloat(card_data.current_value)<=0){
					$("#inputCardCurrentValue",form).css('color','red');
				}
				else{
					$("#inputCardCurrentValue",form).css('color','green');
				}
      }
		}
	});
}
function depositCardCheckSubmit(){
	var card_id = $("#inputCardId").val();
	depositGetData(card_id);
	depositCardGetCardGroupDataTable(card_id);
	depositCardGetCardTransactionDataTable(card_id);
}
function depositCardGetCardGroupDataTable(card_id){
	$('#card-group-datatable').dataTable().fnClearTable();
  $.ajax({
    type: 'GET',
		url: couponApiBaseUrl+'/card/get_card_in_group',
    data: {'card_id':card_id},
    beforeSend: showPageLoading,
    success: function(data) {
    	var cardList=new Array();
      if(data.error!=""){
        alert(data.error);
      }
      else{
      	cardList = data.data.card_list;
      }
      if(cardList.length>0){
				$('#card-group-datatable').DataTable().rows.add(cardList).draw();
      }
    },
    dataType: "json",
    async:true,
    complete: hidePageLoading
  }); 
}
function depositCardGetCardTransactionDataTable(card_id){
	$('#card-transaction-datatable').dataTable().fnClearTable();
  $.ajax({
    type: 'GET',
		url: couponApiBaseUrl+'/card/get_transaction',
    data: {'card_id':card_id},
    beforeSend: showPageLoading,
    success: function(data) {
    	var transactionList=new Array();
      if(data.error!=""){
        alert(data.error);
      }
      else{
      	transactionList = data.data.transaction_list;
      }
      if(transactionList.length>0){
				$('#card-transaction-datatable').DataTable().rows.add(transactionList).draw();
      }
    },
    dataType: "json",
    async:true,
    complete: hidePageLoading
  }); 
}
function depositCardCheckOnclick(card_id){
	$("#inputCardId").val(card_id);
	depositCardCheckSubmit();
}
if(viewName=="deposit-view"){
	$(function(){

		cardGroupDataTable = $('#card-group-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.card_id_display;
					}
				},
	            { 	"mData" : null, "sClass": "left",
					"mRender": function ( data, type, full ) {
						return full.card_name;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.card_role;
					}
				}
	        ],
	    "aaSorting": [[ 1, "asc" ]],
	    "bProcessing": true,
	    "bServerSide": false,
	    "aaData" : null,
			"bFilter": false,
			"bInfo": false,
			"bPaginate": false,
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);  
			}
		});


		cardTransactionDataTable = $('#card-transaction-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.create_date;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.child_card_id!=null) return full.child_card_id_display;
						return full.card_id_display;
					}
				},
	            { 	"mData" : null, "sClass": "left",
					"mRender": function ( data, type, full ) {
						if(full.child_card_id!=null) return full.child_card_name;
						return full.card_name;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.card_role;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.transaction_type;
					}
				},
	            { 	"mData" : null, "sClass": "right",
					"mRender": function ( data, type, full ) {
						var change_value = full.add_value - full.use_value;
						return parseFloat(change_value).formatMoney(2,'.',',');
					}
				},
	            { 	"mData" : null, "sClass": "right",
					"mRender": function ( data, type, full ) {
						return parseFloat(full.left_value).formatMoney(2,'.',',');
					}
				}
	        ],
	    "aaSorting": [[ 0, "desc" ]],
	    "bProcessing": true,
	    "bServerSide": false,
	    "aaData" : null,
			"bFilter": false,
			"bInfo": false,
			"bPaginate": false,
			"fnDrawCallback": function ( oSettings ) {
      	bpkDataTableDrawCallback(oSettings,false);
			}
		});

	  cardListDataTable = $('#card-list-datatable').DataTable({
	    "bFilter": true,
	    "responsive": true,
	    "searchDelay": sSearchDelay,
	    "sPaginationType": "full_numbers",
	    "aoColumnDefs": dataTableCustomColumnDef,
	    "aoColumns": [
	      {   "mData" : null, "sClass": "right" },
	      {   "mData" : null,
	        "mRender": function ( data, type, full ) {
						return full.card_id_display;
	        }
	      },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						var returnText=full.hn_name;
						if(full.parent_card_id!=""){
							returnText+="<br/>(บัตรหลัก "+full.parent_card_id_display+" "+full.parent_card_owner+")";
						}
						return returnText;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.card_type_name;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.bpk_hn;
					}
				},
				 { 	"mData" : null, "sClass": "right",
					"mRender": function ( data, type, full ) {
						if(full.card_value==null) return "";
						return parseFloat(full.card_value).formatMoney(2,'.',',');
					}
				},
				 { 	"mData" : null, "sClass": "right",
					"mRender": function ( data, type, full ) {
						if(full.card_value==null) return "";
						return parseFloat(full.current_value).formatMoney(2,'.',',');
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.start_date==null) return "";
						return full.start_date.substring(0,10);
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.expire_date==null) return "";
						else if(full.expire_date<=nowDate){
							return '<span class="label label-danger">'+full.expire_date.substring(0,10)+'</span>';
						}
						return full.expire_date.substring(0,10);
					}
				},	           
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.create_date;
					}
				},
	      {   "mData" : null, "sClass": "center",
	        "mRender": function ( data, type, full ) {
						return '<button style="width:75px;" onclick="depositCardCheckOnclick(\''+full.card_id_display+'\');" class="btn btn-primary">เช็คยอด</button>';
	        }
	      }
	    ],
	    "aaSorting": [[ 1, "asc" ]],
	    "bProcessing": true,
	    "bServerSide": true,
	    "sAjaxSource": couponApiBaseUrl+'/'+'card/get_card_list',
	    "sServerMethod": "POST",
	    "fnServerParams": function ( aoData ) {
		  	aoData.push( { "name": "hn", "value": $("#form-card-list-search #inputFilterHN").val() } );
		  	aoData.push( { "name": "name", "value": $("#form-card-list-search #inputFilterName").val() } );
		  	aoData.push( { "name": "card_id", "value": $("#form-card-list-search #inputFilterCardId").val() } );
	    },
	    "fnDrawCallback": function ( oSettings ) {
	      bpkDataTableDrawCallback(oSettings);
	    },
	    "iDisplayLength": 10,
	    'fixedHeader': true
	  });
	  $("#table-card-list-submit").click(function(){
	    bpkDataTableSearchSubmit(cardListDataTable);
	    return false;
	  });
	});
}
//end deposit-view


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
		var bpkDataTableQueue=$('#queue-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
						return (full.is_ior=='T'?'<i class="glyphicon glyphicon-info-sign"></i> ':'')+full.title;
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
	      { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.service_detail;
					}
				},
	      { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+projectViewUrl+'/'+full.project_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
					}
				},
	      { 	"mData" : null , "sClass": "center", "bVisible": false,
					"mRender": function ( data, type, full ) {
						if(full.is_ior=='T') return '';
						return '<a href="'+queueAcceptRequestUrl+'/'+full.project_id+'" class="btn btn-primary" rel="tooltip" data-title="รับงาน"><i class="glyphicon glyphicon-ok"></i></a>';
					}
				},
	      { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="'+queueCreatProjectUrl+'/'+full.project_id+'" class="btn btn-success" rel="tooltip" data-title="สร้างใบบันทึก"><i class="glyphicon glyphicon-plus-sign"></i></a>';
					}
				},
	      { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.attachment_count>0){
							return '<i class="glyphicon glyphicon-file"></i>';
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

		$("#table-queue-submit").click(function(){
			bpkDataTableSearchSubmit(bpkDataTableQueue);
			return false;
		});
		//refresh table queue automatically
		setInterval('bpkDataTableSearchSubmit($("table#queue-datatable.display"));',1000*60*5);
	};

	var functionInitTableProject=function(){
		//Table Project
		var bpkDataTableProject=$('#project-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
							return '<span class="label label-danger">'+full.request_priority_detail+'</span>';
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
						return '<a target="_blank" href="'+projectViewUrl+'/'+full.project_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
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
			      aoData.push( { "name": "inform_hos_id", "value": $("#inputInformHospitalId_Project").val() } );
			      aoData.push( { "name": "inform_section_id", "value": $("#inputInformSectionId_Project").val() } );
			      aoData.push( { "name": "accept_hos_id", "value": $("#inputAcceptHospitalId_Project").val() } );
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
		  		var parentElem=$(elem).closest('div.fileinput');
		  		var twainUploadTmpRunningNo=parentElem.find("input[name='twainUploadTmpRunningNo[]']");
		  		var twainUploadFileName=parentElem.find("input[name='twainUploadFileName[]']");
		  		twainUploadTmpRunningNo.val($("#inputPostTmpFileScanRunningNo").val());
		  		bootstrapFileInputChange(twainUploadTmpRunningNo);
		  		parentElem.find('span.btn.btn-file').hide();
		  		parentElem.find('a.btn.fileinput-exists').show();
		  		parentElem.find('a.btn.fileinput-exists').click(function(){
		  			$(this).closest('div.fileinput').remove();
		  		});
		  		parentElem.find('a.twainStartScan').hide();
		  		var fileName=data.upload_date.substring(0,10)+'-'+(parentElem.index()+1);
		  		parentElem.find('span.fileinput-filename').html(fileName);
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

			ajaxGetServicePoint($("#inputSectionId"),$("#inputServicePointId"),null,'T');
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
	$("#inputSectionId").change(function(){
		ajaxGetServicePoint($("#inputSectionId"),$("#inputServicePointId"),null,'T');
	});

	if(selectedSectionId!=null){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),selectedSectionId,'T',function(){
			ajaxGetServicePoint($("#inputSectionId"),$("#inputInformServicePointId"),null,'T');
			ajaxGetServicePoint($("#inputSectionId"),$("#inputServicePointId"),null,'T');
		});
	}
	else{
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,'T',function(){
			ajaxGetServicePoint($("#inputSectionId"),$("#inputInformServicePointId"),null,'T');
			ajaxGetServicePoint($("#inputSectionId"),$("#inputServicePointId"),null,'T');
		});
	}

	var inputServiceElem=$("#inputService");
	inputServiceElem.change(function(){
		var detail=inputServiceElem.find('option[value='+$(this).val()+']').attr('attr-detail-template');
		if(detail!=null && detail!=""){
			$("#inputDescription").val(detail);
		}
	});
}
//end request

//request-ior
function validateRequestIorForm(){
	var passValidate=true;

	// passValidate=checkInputTypeText($("#inputManagement")) && passValidate;
	passValidate=checkInputTypeText($("#inputConclusion")) && passValidate;
	passValidate=checkInputTypeText($("#inputDescription"),3) && passValidate;
	passValidate=checkInputTypeSelect($("#inputRiskDetect")) && passValidate;

	passValidate=checkInputTypeSelect($("#inputShift")) && passValidate;

	passValidate=checkInputTypeText($("#inputFoundDate")) && passValidate;
	passValidate=checkInputTypeText($("#inputEventDate")) && passValidate;
	passValidate=checkInputTypeSelect($("#inputIorSeverityCode")) && passValidate;
	passValidate=checkInputTypeSelect($("#inputIorLocation")) && passValidate;
	passValidate=checkInputTypeSelect($("#inputIorMaster")) && passValidate;
	passValidate=checkInputTypeSelect($("#inputIorHospitalId")) && passValidate;
	if($("#inputIsSelfReport").is(":checked")){
		passValidate=checkInputTypeText($("#inputPrevention")) && passValidate;
	}

	return passValidate;
}
var $inputIorMaster=null;
var $inputIorSeverityCode=null;
function onInputIorMasterChange(severityCode){
	var ior_master_id=$('#inputIorMaster').val();
	var ior_name=$('#inputIorMaster')[0].textContent;
	if(1==0 && ior_name.indexOf("ไม่ระบุ")!=-1){
		$('#inputIorMasterOther').closest('.form-group').parent().show();
		$("#inputIorMasterNotFound").prop('checked',true);
	}
	else{
		$('#inputIorMasterOther').closest('.form-group').parent().hide();
		$("#inputIorMasterNotFound").prop('checked',false);
		$('#inputIorMasterOther').val('');
	}


	$.ajax({
		type: 'POST',
		url: ajaxGetIorSeverityFromIorMasterUrl,
		data:  {"ior_master_id":ior_master_id},
		dataType: "json",
		async:true,
		success: function(data) {
			var selectize = $inputIorSeverityCode[0].selectize;
			selectize.clearOptions();
			for(var i in data){
				selectize.addOption({value:data[i],text:data[i]}); 
			}
			selectize.refreshOptions(false);
			if(severityCode!=null) selectize.setValue(severityCode);
		}
	});

  var iorMasterText = $( "#inputIorMaster option:selected" ).text();
  $("#inputConclusion").val(iorMasterText);

	$.ajax({
		type: 'POST',
		url: ajaxGetIorSuggestionFromIorMasterUrl,
		data:  {"ior_master_id":ior_master_id},
		dataType: "json",
		async:true,
		success: function(data) {			
      if (data!=null){
          $("#inputIorMaster").closest('div').find('.help-inline').html(data.ior_brief);
          $("#inputDescription").attr("placeholder",data.ior_desc);
          $("#inputManagement").attr("placeholder",data.ior_manage);
      } else {
          $("#inputIorMaster").closest('div').find('.help-inline').html("");
          $("#inputDescription").attr("placeholder","");
          $("#inputManagement").attr("placeholder","");
      }
		}
	});

	previewIorService();
}
function previewIorService(){	
	var ior_master_id=$('#inputIorMaster').val();
	if($("#inputIorHospitalId").size()>0){
		$.ajax({
			type: 'POST',
			url: ajaxGetIorMasterServiceFromIorMasterUrl,
			data:  {"ior_master_id":ior_master_id,'hos_id':$("#inputIorHospitalId").val()},
			dataType: "json",
			async:true,
			success: function(data) {			
	      if (data!=null){
	      	$("#infoServiceType").val(data.servicetype_detail);
	      	$("#infoService").val(data.service_detail);
	      	$("#infoServicePoint").val(data.service_point_detail);
	      	$("#inputIorMasterService_SectionId").val(data.section_id);
	      	$("#inputIorMasterService_RequestTypeId").val(data.request_type_id);
	      	$("#inputIorMasterService_ServiceTypeId").val(data.servicetype_id);
	      	$("#inputIorMasterService_ServiceId").val(data.service_id);
	      	if(data.service_point_id==null){
	      		$("#inputIorMasterService_ServicePointId").val(data.default_service_point_id);
	      	}
	      	else{
	      		$("#inputIorMasterService_ServicePointId").val(data.service_point_id);
	      	}
	      } else {
	      	$("#infoServiceType").val('');
	      	$("#infoService").val('');
	      	$("#infoServicePoint").val('');
	      	$("#inputIorMasterService_SectionId").val('');
	      	$("#inputIorMasterService_RequestTypeId").val('');
	      	$("#inputIorMasterService_ServiceTypeId").val('');
	      	$("#inputIorMasterService_ServiceId").val('');
	      	$("#inputIorMasterService_ServicePointId").val('');
	      }
			}
		});
	}
}
function onInputIorHosChange(){
	var hos_id=$('#inputIorHospitalId').val();

	$.ajax({
		type: 'POST',
		url: ajaxGetIorLocationFromHosIdUrl,
		data:  {"hos_id":hos_id},
		dataType: "json",
		async:true,
		success: function(data) {
			var selectize = $inputIorLocation[0].selectize;
			selectize.clearOptions();
			for(var i in data){
				selectize.addOption(data[i]); 
			}
			selectize.refreshOptions(false);
		}
	});

	previewIorService();
}
function onInputRiskEffectChange(){	
	if($("input.inputRiskEffect[value='ผู้ป่วย']").is(":checked")){
		$("#inputRiskHn").closest('.form-group').parent().show();
	}
	else{			
		$("#inputRiskHn").closest('.form-group').parent().hide();
	}
}
function requestIorOnChangeIorTopic(selectedText,selectedValue,param1,selectedObject){
	if(selectedObject!=null){
		var selectize = $("#inputIorMaster").get(0).selectize;
		clearSelectize(selectize);
		selectize.open();
	}
	else{
	}
}
function requestIorInitIorTopic(){
	var paramKeys=new Array();
	paramKeys.push('ior_clinical');
	var paramElems=new Array();
	paramElems.push("input[name=inputIorClinical]:checked");
	var selectize=initSelectizeRemote2($("#inputIorTopicId"), 1, 'ior_topic_id', 'name', ['code','name'],  'code', false, ajaxGetIorTopicSelectizeUrl,'requestIorOnChangeIorTopic',paramKeys,paramElems,null, null, false);
	selectize=selectize[0].selectize;
	clearSelectize(selectize);
}
function requestIorOnChangeIorMaster(selectedText,selectedValue,param1,selectedObject){
	if(selectedObject!=null){
	}
	else{
	}
}
function requestIorInitIorMaster(){
	var paramKeys=new Array();
	paramKeys.push('ior_topic_id');
	var paramElems=new Array();
	paramElems.push("#inputIorTopicId");
	var selectize=initSelectizeRemote2($("#inputIorMaster"), 1, 'ior_master_id', 'ior_name', ['ior_name','keyword','ior_code'],  'ior_name', false, ajaxGetIorMasterSelectizeUrl,'requestIorOnChangeIorMaster',paramKeys,paramElems,null, null, false);
	selectize=selectize[0].selectize;
	clearSelectize(selectize);
}
function initRequestIor(){
	$("#inputIsSelfReport").click(function(){
		if($(this).is(':checked')){
			$("#inputPrevention").prop('disabled',false);
			$("#inputPrevention").closest('.form-group').find('label').append("<span>*</span>");
		}
		else{
			$("#inputPrevention").prop('disabled',true);			
			$("#inputPrevention").closest('.form-group').find('label span').remove();
		}
	});

	requestIorInitIorTopic();
	requestIorInitIorMaster();

	$("input[name=inputIorClinical]").click(function(){
		var selectize = $("#inputIorTopicId").get(0).selectize;
		clearSelectize(selectize);
		selectize.open();

		var selectize = $("#inputIorMaster").get(0).selectize;
		clearSelectize(selectize);
	});

	/*

	var REGEX_EMAIL = '([a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@' +
                  '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)';

	$inputIorMaster=$('#inputIorMaster').selectize({
	    persist: false,
	    maxItems: 1,
	    valueField: 'ior_master_id',
	    labelField: 'ior_name',
	    searchField: ['ior_name', 'keyword', 'legacy_code'],
	    sortField: [
        {
            field: 'sorting',
            direction: 'asc'
        },
        {
            field: '$score'
        }],
	    options: iorMasterList,
	    render: {
	        item: function(item, escape) {
	            return '<div>' +
	                (item.ior_name ? '<span class="ior_name">' + escape(item.ior_name) + '</span>' : '') +
	                // (item.email ? '<span class="email">' + escape(item.email) + '</span>' : '') +
	            '</div>';
	        },
	        option: function(item, escape) {
	            var label = item.ior_name;
	            // var caption = item.name ? item.email : null;
	            return '<div>' +
	                '<span class="label">' + escape(label) + '</span>' +
	                // (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
	            '</div>';
	        }
	    },
	    onInitialize: function(){
	    	if($("#inputIorMasterId").size()>0){
	    		this.setValue($("#inputIorMasterId").val());
	    		onInputIorMasterChange($("#inputIorSeverityCode").val());
	    	}
	    }
	});
*/

	$inputIorLocation=$('#inputIorLocation').selectize({
	    persist: false,
	    maxItems: 1,
	    valueField: 'ior_location_id',
	    labelField: 'location_name',
	    searchField: ['location_name', 'keyword'],
	    options: iorLocationList,
	    render: {
	        item: function(item, escape) {
	            return '<div>' +
	                (item.location_name ? '<span class="location_name">' + escape(item.location_name) + '</span>' : '') +
	                // (item.email ? '<span class="email">' + escape(item.email) + '</span>' : '') +
	            '</div>';
	        },
	        option: function(item, escape) {
	            var label = item.location_name;
	            // var caption = item.name ? item.email : null;
	            return '<div>' +
	                '<span class="label">' + escape(label) + '</span>' +
	                // (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
	            '</div>';
	        }
	    },
	    onInitialize: function(){
	    	if($("#inputIorLocationId").size()>0){
	    		this.setValue($("#inputIorLocationId").val());
	    	}
	    }
	});

	$("input.inputRiskEffect[value='ผู้ป่วย']").change(function(){
		onInputRiskEffectChange();
	});


	$inputIorSeverityCode=$('#inputIorSeverityCode').selectize({
	    create: false
	});

	$('#inputIorMaster').change(function(){
		onInputIorMasterChange();
	});

	$('#inputIorHospitalId').change(function(){
		onInputIorHosChange();
	});

	$("#inputIorMasterNotFound").change(function(){
		if($(this).is(":checked")){
			var selectize = $("#inputIorMaster").get(0).selectize;
			selectize.setValue(iorMasterNotSpecify);
		}
		else{
			var selectize = $("#inputIorMaster").get(0).selectize;
			selectize.setValue('');
		}
	});


	$("#inputRiskHn").keyup(function (){
		var hn=$(this).val();
		if((hn.length==1 || hn.length==4) && hn.length>oldCheckHn.length){
			hn+="-";
			$(this).val(hn);
		}

		if(oldCheckHn!=hn){
			/*if(hn.length==11){
				estCostGetPatientByHn(hn);
			}
			else{
		  	$("#div-inputHN span.help-inline").html('');
			}*/
		}
		oldCheckHn=hn;
	});

}
if(viewName=="request-ior"){
	$/*("#inputHospitalId").change(function(){
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
	});*/

	initRequestIor();
}
//end request-ior


//po-index
function printPo(po_id){
	openBiPdf('form-po'+form_name_site,{'po_id' : po_id});
}
function poCosign(){
	var confirmText="ยืนยัน Cosign";
	openModal(confirmText,confirmText+"?",true,function(){
		$("#poAction").val('cosign');
		$("#form-po-detail").submit();
	});
}
function poReview(){
	var confirmText="ยืนยันการตรวจสอบ";
	openModal(confirmText,confirmText+"?",true,function(){
		$("#poAction").val('review');
		$("#form-po-detail").submit();
	});
}
function poApprove(){
	var confirmText="ยืนยันการอนุมัติ";
	openModal(confirmText,confirmText+"?",true,function(){
		$("#poAction").val('approve');
		$("#form-po-detail").submit();
	});
}
function poReject(){
	var confirmText="ยืนยัน ไม่อนุมัติ";
	openModal(confirmText,confirmText+"?",true,function(){
		$("#poAction").val('reject');
		$("#form-po-detail").submit();
	});
}
function poApproveIt(){
	var confirmText="ยืนยันการอนุมัติ";
	openModal(confirmText,confirmText+"?",true,function(){
		$("#poAction").val('approve_it');
		$("#form-po-detail").submit();
	});
}
function poRejectIt(){
	var confirmText="ยืนยัน ไม่อนุมัติ";
	openModal(confirmText,confirmText+"?",true,function(){
		$("#poAction").val('reject_it');
		$("#form-po-detail").submit();
	});
}
function validatePoDetailForm(){
	var passValidate=true;

	return passValidate
}
function getDatatableDataForPoDetail(){
	$('#report-datatable').dataTable().fnClearTable();

	if(poId!=""){
		$.ajax({
		  type: 'POST',
		  url: purchaseApiBaseUrl+'/po/po_item_ajax_datatable',
		  data: {'po_id': poId},
		  beforeSend: null,
		  success: function(data) {
		  	if(data.aaData.length>0){
					$('#report-datatable').dataTable().fnAddData(data.aaData);
				}
			},
		  dataType: "json",
		  async:true,
		  complete: null
		});	
	}
}
if(viewName=="po-index"){
	var bpkDataTable=$('#report-datatable').DataTable({
		'tabIndex': -1,
		"responsive": true,
		"searchDelay": sSearchDelay,
		"sPaginationType": "full_numbers",
		"aoColumnDefs": dataTableCustomColumnDef,
		"aoColumns": [
      { 	"mData" : null, "sClass": "right"	},
      { 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.item_code;
				}
			},
			{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.item_name;
				}
			},
			{ 	"mData" : null, "sClass": "left",
				"mRender": function ( data, type, full ) {
					return parseFloat(full.price_per_unit_buy).formatMoney(2,'.',',')+' ต่อ '+full.unit_buy;
				}
			},
			{ 	"mData" : null, "sClass": "left",
				"mRender": function ( data, type, full ) {
					return full.receive_date;
				}
			},
			{ 	"mData" : null, "sClass": "left",
				"mRender": function ( data, type, full ) {
					return full.department_id;
				}
			},
			{ 	"mData" : null, "sClass": "left",
				"mRender": function ( data, type, full ) {
					return '<a target="_blank" href="'+prViewUrl+'/'+full.pr_id+'">'+full.pr_code+'</a>';
				}
			},
			{ 	"mData" : null, "sClass": "left",
				"mRender": function ( data, type, full ) {
					return full.pr_create_date;
				}
			},
			{ 	"mData" : null, "sClass": "left",
				"mRender": function ( data, type, full ) {
					return full.pr_create_by_emp_name;
				}
			},
			{ 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
					return parseFloat(full.amt_order).formatMoney(2,'.',',');
				}
			},
			{ 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
					return parseFloat(full.amt_left).formatMoney(2,'.',',');
				}
			},
			{ 	"mData" : null, "bVisible": false,
				"mRender": function ( data, type, full ) {
					return full.po_item_id;
				}
			}
    ],
    "aaSorting": [[ 11, "asc" ]],
		"bProcessing": true,		
		"aaData" : null,
		"fnServerParams": function ( aoData ) {
		},
		"fnDrawCallback": function ( oSettings ) {
			bpkDataTableDrawCallback(oSettings,null,true);
		},
		"iDisplayLength": 10,
		'fixedHeader': true
	});

	getDatatableDataForPoDetail();
}
//end po-index


//pr-index
function printPr(pr_id){
	openBiPdf('form-pr'+form_name_site,{'pr_id' : pr_id});
}
function prApprove(pr_id, approve_type){
	$("#prAction").val(approve_type);
	$("#form-pr-detail").submit();
}
function validatePrDetailForm(){
	var passValidate=true;

	return passValidate
}
function getDatatableDataForPrDetail(){
	$('#reprrt-datatable').dataTable().fnClearTable();

	if(prId!=""){
		$.ajax({
		  type: 'POST',
		  url: purchaseApiBaseUrl+'/pr/pr_item_ajax_datatable',
		  data: {'pr_id': prId},
		  beforeSend: null,
		  success: function(data) {
		  	if(data.aaData.length>0){
					$('#report-datatable').dataTable().fnAddData(data.aaData);
				}
			},
		  dataType: "json",
		  async:true,
		  complete: null
		});	
	}
}
if(viewName=="pr-index"){
	var bpkDataTable=$('#report-datatable').DataTable({
		'tabIndex': -1,
		"responsive": true,
		"searchDelay": sSearchDelay,
		"sPaginationType": "full_numbers",
		"aoColumnDefs": dataTableCustomColumnDef,
		"aoColumns": [
      { 	"mData" : null, "sClass": "right"	},
        {   "mData" : null,
          "mRender": function ( data, type, full ) {
            return full.item_code;
          }
        },
        {   "mData" : null,
          "mRender": function ( data, type, full ) {
            return full.item_name;
          }
        },
        {   "mData" : null, "sClass": "center",
          "mRender": function ( data, type, full ) {
            return full.item_acc_type_id;
          }
        },
        {   "mData" : null,
          "mRender": function ( data, type, full ) {
            return full.base_drug_type_desc;
          }
        },
              {   "mData" : null, "sClass": "right",
          "mRender": function ( data, type, full ) {
            return parseFloat(full.order_qty).formatMoney(2,'.',',');
          }
        },
        {   "mData" : null, "sClass": "left",
          "mRender": function ( data, type, full ) {
            return full.unit_text;
          }
        },
              {   "mData" : null, "sClass": "right",
          "mRender": function ( data, type, full ) {
          	if(full.min==null) return '';
            return parseFloat(full.min).formatMoney(2,'.',',');
          }
        },
              {   "mData" : null, "sClass": "right",
          "mRender": function ( data, type, full ) {
          	if(full.max==null) return '';
            return parseFloat(full.max).formatMoney(2,'.',',');
          }
        },
              {   "mData" : null, "sClass": "right",
          "mRender": function ( data, type, full ) {
          	if(full.on_hand==null) return '';
            return parseFloat(full.on_hand).formatMoney(2,'.',',');
          }
        },
              {   "mData" : null, "sClass": "right",
          "mRender": function ( data, type, full ) {
          	if(full.on_order==null) return '';
            return parseFloat(full.on_order).formatMoney(2,'.',',');
          }
        },
        {   "mData" : null, "sClass": "left",
          "mRender": function ( data, type, full ) {
            return full.note;
          }
        },
				{ 	"mData" : null, "bVisible": false,
					"mRender": function ( data, type, full ) {
						return full.pr_item_id;
					}
				},
        {   "mData" : null, "sClass": "center",
          "mRender": function ( data, type, full ) {
          	if(full.po_id==null) return '';
						return '<a target="_blank" href="'+poViewUrl+'/'+full.po_id+'">'+full.po_code+'</a>';
          }
        }

    ],
    "aaSorting": [[ 12, "asc" ]],
		"bProcessing": true,		
		"aaData" : null,
		"fnServerParams": function ( aoData ) {
		},
		"fnDrawCallback": function ( oSettings ) {
			bpkDataTableDrawCallback(oSettings,null,true);
		},
		"iDisplayLength": 10,
		'fixedHeader': true
	});

	getDatatableDataForPrDetail();
}
//end pr-index


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
function projectApproveAdd(project_id){
	showPageLoading();
	$.post(projectApproveAddApproveUrl, {"emp_id": userEmpId, "project_id":project_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","บันทึกการอนุมัติเรียบร้อย",false,null);
			$("#buttonProjectApproveAdd").hide();
			$("#buttonProjectApproverReject").hide();
			$("#buttonProjectApproveDelete").show();
			$('span.my-approve-status').removeClass('label-danger').addClass('label-success').html('(อนุมัติแล้ว)');
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function projectApproveDelete(project_id){
	showPageLoading();
	$.post(projectApproveDeleteUrl, {"emp_id": userEmpId, "project_id":project_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ยกเลิกการอนุมัติเรียบร้อย",false,null);
			$("#buttonProjectApproveDelete").hide();
			$("#buttonProjectApproveAdd").show();
			$("#buttonProjectApproverReject").show();
			$('span.my-approve-status').removeClass('label-success').addClass('label-danger').html('(รออนุมัติ)');
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function projectApproverReject(project_id){
	showPageLoading();
	$.post(projectApproverRejectUrl, {"emp_id": userEmpId, "project_id":project_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","บันทึกเรียบร้อย",false,null);
			$("#buttonProjectApproverReject").hide();
			$("#buttonProjectApproveAdd").hide();
			$("#buttonProjectApproverCancelReject").show();
			$('span.my-approve-status').removeClass('label-danger').addClass('label-danger').html('(ไม่อนุมัติ)');
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function projectApproverCancelReject(project_id){
	showPageLoading();
	$.post(projectApproverCancelRejectUrl, {"emp_id": userEmpId, "project_id":project_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ยกเลิกเรียบร้อย",false,null);
			$("#buttonProjectApproverCancelReject").hide();
			$("#buttonProjectApproverReject").show();
			$("#buttonProjectApproveAdd").show();
			$('span.my-approve-status').removeClass('label-success').addClass('label-danger').html('(รออนุมัติ)');
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

	if(projectReadonly) return true;

	//check input bottom up
	if($("#inputProjectDateEnd").val()!="" || $("#inputEmployeeId").val()!="" ){
		passValidate=checkInputTypeDateBetween($("#inputProjectDateStart"),$("#inputProjectDateEnd")) && passValidate;
	}
	passValidate=checkInputTypeSelect($("#inputProjectService")) && passValidate;
	passValidate=checkInputTypeText($("#inputProjectTitle"),3) && passValidate;

	return passValidate;
}
function quickProjectAction(action){
	if(projectReadonly){
		var passValidate=validateProjectForm();
		$.ajax({
		  type: 'POST',
		  url: ajaxCheckUnfinishedTaskUrl,
		  data:  {"project_id":$("input[name=inputProjectId]").val()},
		  success: function(data) {
		  	if(data.count_task>0){
		  		passValidate=false;
					openModal("fail",'พบงานที่ยังไม่เสร็จสิ้น',false,null);
				}
			},
		  dataType: "json",
		  async:false
		});

		if(passValidate){
			$("#inputProjectReadonly").val('T');
			$("#inputQuickAction").val(action);
			$("#form-project-detail").submit();
		}
	}
	else{
		var passValidate=validateProjectForm();
		$.ajax({
		  type: 'POST',
		  url: ajaxCheckUnfinishedTaskUrl,
		  data:  {"project_id":$("input[name=inputProjectId]").val()},
		  success: function(data) {
		  	if(data.count_task>0){
		  		passValidate=false;
					openModal("fail",'พบงานที่ยังไม่เสร็จสิ้น',false,null);
				}
			},
		  dataType: "json",
		  async:false
		});

		if(passValidate){
			$("#inputProjectReadonly").val('F');
			$("#inputQuickAction").val(action);
			$("#form-project-detail").submit();
		}
	}
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
		var file = $(elem).closest('.fileinput');
		file.fileinput('clear');
		if(file.next().hasClass('fileinput-last')){
			file.next().remove();
			file.addClass('fileinput-last');
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
function initCarBookingFormData(projectId){
	$.ajax({
	  type: 'POST',
	  url: projectGetCarBookingUrl,
	  data: {'project_id':projectId},
	  beforeSend: showPageLoading,
	  success: function(data) {
	  	if(data.error!=''){
        openModal("fail",data.error,false,null);
        return;
	  	}
	  	var car_booking = data.car_booking;
	  	var passenger_list = data.passenger_list;
	  	$("#inputCarBookingProjectId").val(car_booking.project_id);
	  	var selectize = $("#inputCarBookingLicensePlateId").get(0).selectize;
	  	clearSelectize(selectize);
			selectize.addOption([{'car_license_plate_id':car_booking.car_license_plate_id, 'license_plate':car_booking.license_plate}]);
			selectize.setValue(car_booking.car_license_plate_id);

			//update calendar
	  	var selectize = $("#inputCalendarSelectLicensePlate").get(0).selectize;
	  	clearSelectize(selectize);
			selectize.addOption([{'car_license_plate_id':car_booking.car_license_plate_id, 'license_plate':car_booking.license_plate}]);
			selectize.setValue(car_booking.car_license_plate_id);
			carBookingCalendar.fullCalendar('refetchEvents');

	  	var selectize = $("#inputCarBookingDriver").get(0).selectize;
	  	clearSelectize(selectize);
			selectize.addOption([{'emp_id':car_booking.driver, 'emp_name':car_booking.driver_name}]);
			selectize.setValue(car_booking.driver);

	  	$("#inputCarBookingDriverOther").val(car_booking.driver_other);

	  	var selectize = $("#inputCarBookingPassengers").get(0).selectize;
	  	clearSelectize(selectize);
	  	var emp_ids = new Array();
	  	for(var i in passenger_list){
				selectize.addOption({'emp_id':passenger_list[i].emp_id, 'emp_name':passenger_list[i].emp_name});
	  		emp_ids.push(passenger_list[i].emp_id);
	  	}
			selectize.setValue(emp_ids);

	  	$("#inputCarBookingPassengerOther").val(car_booking.passenger_other);
	  	$("#inputCarBookingDestination").val(car_booking.destination);
	  	$("#inputCarBookingFlightNo").val(car_booking.flight_no);
	  	$("#inputCarBookingRequestTimeLeave").val(car_booking.request_time_leave);
	  	$("#inputCarBookingRequestTimeDesArrive").val(car_booking.request_time_des_arrive);
	  	$("#inputCarBookingTimeLeave").val(car_booking.time_leave);
	  	$("#inputCarBookingTimeArrive").val(car_booking.time_arrive);
	  	$("#inputCarBookingTravelTime").val(car_booking.travel_time);
	  	$("#inputCarBookingDistance").val(car_booking.distance);
	  	$("#inputCarBookingMileLeave").val(car_booking.mile_leave);
	  	$("#inputCarBookingMileArrive").val(car_booking.mile_arrive);
		},
	  dataType: "json",
	  async:true,
	  complete: hidePageLoading
	});
}
function validateProjectCarBookingForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeText($("#inputCarBookingDestination")) && passValidate;
	passValidate=checkInputTypeSelect($("#inputCarBookingLicensePlateId")) && passValidate;

	return passValidate;
}
function initCarBookingForm(){
  var paramKeys=new Array();
  paramKeys.push('hos_id');
  var paramElems=new Array();
  paramElems.push(projectData.project_hos_id);
  var selectize=initSelectizeRemote2($("#inputCarBookingLicensePlateId"), 1, 'car_license_plate_id', 'license_plate', ['license_plate'],  'license_plate', false, ajaxGetCarLicensePlateSelectizeUrl,null,paramKeys,paramElems,null,null,false);
  selectize=selectize[0].selectize;
  clearSelectize(selectize);	

  var paramKeys=new Array();
  var paramElems=new Array();
  var selectize=initSelectizeRemote2($("#inputCarBookingDriver"), 1, 'emp_id', 'emp_name', ['emp_id','emp_name'],  'emp_id', true, ajaxGetEmployeeNameRemoteUrl,null,paramKeys,paramElems,null,null,false);
  selectize=selectize[0].selectize;
  clearSelectize(selectize);	

  var paramKeys=new Array();
  var paramElems=new Array();
  var selectize=initSelectizeRemote2($("#inputCarBookingPassengers"), 10, 'emp_id', 'emp_name', ['emp_id','emp_name'],  'emp_id', true, ajaxGetEmployeeNameRemoteUrl,null,paramKeys,paramElems,null,null,false);
  selectize=selectize[0].selectize;
  clearSelectize(selectize);
}
function refreshProjectCalendar(){
	$('#calendar').fullCalendar('removeEventSources');
	$('#calendar').fullCalendar('addEventSource',getProjectCalendarEventSource());
}
function getProjectCalendarEventSource(){
	var emp_id=$("#inputCalendarSelectEmp").val();
	var project_id='';
	if($("#inputCalendarSelectProject").size()>0){
		project_id=$("#inputCalendarSelectProject").val();
	}
	else{
		project_id=projectData.project_id;
	}

	return {
		      url: ajaxProjectCalendarUrl,
		      type: 'POST',
		      data: {
						'project_id': project_id,
						'emp_id': emp_id,
						"viewType":$("input[name=inputCalendarSelectViewType]:checked").val(),
						"checkboxPlanToPlan":$("#calendarCheckboxPlanToPlan").is(":checked"),
						"checkboxPlanToFinish":$("#calendarCheckboxPlanToFinish").is(":checked"),
						"checkboxAcceptToFinish":$("#calendarCheckboxAcceptToFinish").is(":checked")
		      },
		      error: function() {
		        alert('there was an error while fetching events!');
		      },
		      color: 'yellow',   // a non-ajax option
		      textColor: '#fff' // a non-ajax option
		    };
}
function refreshCarBookingCalendar(){
	$('#calendar-car-booking').fullCalendar('removeEventSources');
	$('#calendar-car-booking').fullCalendar('addEventSource',getCarBookingCalendarEventSource());
}
function getCarBookingCalendarEventSource(){
	return {
		      url: ajaxProjectCalendarCarBookingUrl,
		      type: 'POST',
		      data: {
						'project_id': projectData.project_id,
						'car_license_plate_id': $("#inputCalendarSelectLicensePlate").val(),
						"viewType":$("input[name=inputCarBookingCalendarSelectViewType]:checked").val(),
						"checkboxByRequest":$("#calendarCarBookingCheckboxByRequest").is(":checked"),
						"checkboxByActual":$("#calendarCarBookingCheckboxByActual").is(":checked"),
		      },
		      error: function() {
		        alert('there was an error while fetching events!');
		      },
		      color: 'yellow',   // a non-ajax option
		      textColor: '#fff' // a non-ajax option
		    };
}
if(viewName=="project-index"){
	if(projectData.system_type=='car_booking'){
		initCarBookingForm();
		initCarBookingFormData(projectData.project_id);

		$(function(){
			if(projectReadonly){
				readonly_form_elements($('#form-car-booking'));
				$("#form-car-booking #btn-save").hide();
				$("#form-car-booking").on('submit',function(){
					return false;
				});
			}
		});
	}

	var selectize=initSelectizeRemote2($("#inputCCEmpGroupId"), 1, 'emp_group_id', 'name', ['name'],  'name', false, ajaxGetEmpGroupSelectizeUrl,null,null,null,null, null, false);
	selectize=selectize[0].selectize;
	clearSelectize(selectize);
	
	if(projectData.cc_emp_group_id!=null){
		selectize.addOption([{'emp_group_id':projectData.cc_emp_group_id, 'name':projectData.cc_emp_group_name}]);
		selectize.setValue(projectData.cc_emp_group_id);
	}

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
			$("#inputProjectActualTimeStart").parent().find('.input-group-addon').removeClass('hide');
			$("#inputProjectActualTimeEnd").removeAttr('readonly');
			$("#inputProjectActualTimeEnd").parent().find('.input-group-addon').removeClass('hide');
		}
		else{
			$("#inputProjectActualTimeStart").attr('readonly',true);
			$("#inputProjectActualTimeStart").parent().find('.input-group-addon').addClass('hide');
			$("#inputProjectActualTimeEnd").attr('readonly',true);
			$("#inputProjectActualTimeEnd").parent().find('.input-group-addon').addClass('hide');
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
		
		ajaxGetServicePoint(null,$("#inputProjectInformServicePointId"),$("#inputCurrentProjectInformServicePointId").val(),'T');
		ajaxGetServicePoint(null,$("#inputProjectServicePointId"),$("#inputCurrentProjectServicePointId").val(),'T');

		//Table Project Activity
		var bpkDataTableProjectActivity=$('#project-activity-datatable').DataTable({
			"bFilter": false,
			"responsive": true,
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
						if(hideInformUser && informUserId==full.actor_emp_id){
							return '';
						}
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
		var bpkDataTableProjectTask=$('#project-task-datatable').DataTable({
			"bFilter": false,
			"responsive": true,
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
							return '<i class="glyphicon glyphicon-file"></i>';
						}
						else{
							return '';
						}
					}
				},
	      { 	"mData" : null , "sClass": "center nowrap",
					"mRender": function ( data, type, full ) {
						if(canEditTask){
							return '<a target="_blank" href="'+taskViewUrl+'/'+full.task_id+'" class="btn btn-primary margin-right3" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>'
							+'<button onclick="upTaskOrder(\''+full.task_id+'\',$(\'#project-task-datatable\'));" class="btn '+(full.task_order=="1"?'':'btn-success')+' margin-right3 '+(full.task_order=="1"?'disabled':'')+'" rel="tooltip" data-title="Up"><i class="glyphicon glyphicon-arrow-up"></i></button>'
							+'<button onclick="downTaskOrder(\''+full.task_id+'\',$(\'#project-task-datatable\'));" class="btn '+(full.is_max_task_order=="1"?'':'btn-danger')+' margin-right3 '+(full.is_max_task_order=="1"?'disabled':'')+'" rel="tooltip" data-title="Down"><i class="glyphicon glyphicon-arrow-down"></i></button>';
						}
						else{
							return '<a target="_blank" href="'+taskViewUrl+'/'+full.task_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
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
				 		if(data.aaData.length>0){
							$('#project-task-datatable').dataTable().fnAddData(data.aaData);
						}
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

		/*
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
				$.post(ajaxProjectCalendarUrl, { "start":start.toISOString(),"end":end.toISOString()
					,"project_id":project_id
					,"emp_id":emp_id
					,"viewType":$("input[name=inputCalendarSelectViewType]:checked").val()
					,"checkboxPlanToPlan":$("#calendarCheckboxPlanToPlan").is(":checked")
					,"checkboxPlanToFinish":$("#calendarCheckboxPlanToFinish").is(":checked")
					,"checkboxAcceptToFinish":$("#calendarCheckboxAcceptToFinish").is(":checked")}, function(data) {
						console.log(data);
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
		*/

		var project_id=$("#inputCalendarProjectId").val();
	  var projectCalendar=$('#calendar').fullCalendar({
	  	schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
	    resourceLabelText: 'Calendar',
	    defaultView: 'month',
	  	theme: 'bootstrap3',
			height: 450,
			editable: false,
			resourceAreaWidth: 200,
			header: {
	      left: 'timelineDay,timelineWeek,timelineMonth,month',
	      center: 'title',
			  right: 'prev,next'
			},
			eventSources: [
		  ],
			allDaySlot: false,
			timeFormat: 'HH:mm',
		  eventRender: function(event, element) {
		    element.qtip({
		      content: event.description
		    });
		  },
		  eventClick: function(calEvent, jsEvent, view) {
		  }
	  });

		$("#section-project-calendar").addClass('tab-pane');

		$("#inputCalendarSelectEmp,input[name=inputCalendarSelectViewType], #calendarCheckboxPlanToPlan, #calendarCheckboxPlanToFinish, #calendarCheckboxAcceptToFinish").change(function(){
			refreshProjectCalendar();
		});
		refreshProjectCalendar();


		//calendar-car-booking
		if($('#calendar-car-booking').size()>0){
		  carBookingCalendar=$('#calendar-car-booking').fullCalendar({
		  	schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
		    resourceLabelText: 'Calendar',
		    defaultView: 'month',
		  	theme: 'bootstrap3',
				height: 450,
				editable: false,
				resourceAreaWidth: 200,
				header: {
		      left: 'timelineDay,timelineWeek,timelineMonth,month',
		      center: 'title',
				  right: 'prev,next'
				},
				eventSources: [
			  ],
				allDaySlot: false,
				timeFormat: 'HH:mm',
			  eventRender: function(event, element) {
			    element.qtip({
			      content: event.description
			    });
			  },
			  eventClick: function(calEvent, jsEvent, view) {
			  }
		  });

		  var paramKeys=new Array();
		  paramKeys.push('hos_id');
		  var paramElems=new Array();
		  paramElems.push(projectData.project_hos_id);
		  var selectize=initSelectizeRemote2($("#inputCalendarSelectLicensePlate"), 1, 'car_license_plate_id', 'license_plate', ['license_plate'],  'license_plate', false, ajaxGetCarLicensePlateSelectizeUrl,null,paramKeys,paramElems,null,null,false);
		  selectize=selectize[0].selectize;
		  clearSelectize(selectize);	

			$("#inputCalendarSelectLicensePlate,input[name=inputCarBookingCalendarSelectViewType], #calendarCarBookingCheckboxRequestTime, #calendarCarBookingCheckboxByRequest, #calendarCarBookingCheckboxByActual").change(function(){
				refreshCarBookingCalendar();
			});
		}


		if($("#inputIorMaster").size()>0){
			initRequestIor();
			if(iorTransaction!=null){
				var selectize = $("#inputIorTopicId").get(0).selectize;
				selectize.addOption([{'ior_topic_id':iorTransaction.ior_topic_id, 'code':iorTransaction.ior_topic_code, 'name':iorTransaction.ior_topic_name}]);
				selectize.setValue(iorTransaction.ior_topic_id);

				var selectize = $("#inputIorMaster").get(0).selectize;
				selectize.addOption([{'ior_master_id':iorTransaction.ior_master_id, 'ior_code':iorTransaction.ior_code, 'ior_name':iorTransaction.ior_name}]);
				selectize.setValue(iorTransaction.ior_master_id);

				setTimeout(function(){
					var selectize = $("#inputIorSeverityCode").get(0).selectize;
					selectize.setValue(iorTransaction.ior_severity_code);
				},500);
			}
			onInputRiskEffectChange();
		}
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
function postTaskForm(onSuccess){

	var form=$("#form-task");

	var postUrl = taskPostFormUrl;

  var data = new FormData(form[0]);
  data.append('is_ajax','T');

	$.ajax({
		type: 'POST',
		url: postUrl,
		data:  data,
    enctype: 'multipart/form-data',
    processData: false,
    contentType: false,
		dataType: "json",
		async: true,
    beforeSubmit:  function(){
      showPageLoading();
    },
		success: function(data) {
      hidePageLoading();
      if(data.error!=""){
        openModal("fail",data.error,false,null);
        passValidate = false;
      }
      else{
      	if(onSuccess!=null){
      		onSuccess();
      	}
      	else{
      		$.cookie('bpk_hd_show_success', true, { expires: 365 });
    			location.reload();
    		}
      }
		}
	});
}
function postTaskFormActivity(onSuccess){

	var form=$("#form-task-activity");

	var postUrl = taskPostFormActivityUrl;

  var data = new FormData(form[0]);
  data.append('is_ajax','T');

	$.ajax({
		type: 'POST',
		url: postUrl,
		data:  data,
    enctype: 'multipart/form-data',
    processData: false,
    contentType: false,
		dataType: "json",
		async: true,
    beforeSubmit:  function(){
      showPageLoading();
    },
		success: function(data) {
      hidePageLoading();
      if(data.error!=""){
        openModal("fail",data.error,false,null);
        passValidate = false;
      }
      else{
      	if(onSuccess!=null){
      		onSuccess();
      	}
      	else{
      		$.cookie('bpk_hd_show_success', true, { expires: 365 });
    			location.reload();
    		}
				// bpkDataTableSearchSubmit(bpkDataTableTaskActivity);
      }
		}
	});
}
function submitTaskFormWithActivity(){
	var passValidate = true;
	passValidate = validateTaskForm();

	if(passValidate){
		if($("#inputTaskActionType").val()!='-1'){
			passValidate = validateTaskForm();
			if(passValidate){
				postTaskForm(function(){
					postTaskFormActivity();
				});
			}
		}
		else{
			postTaskForm(null);
		}
	}
}
function submitTaskForm(){
	var passValidate = true;
	passValidate = validateTaskForm();

	if(passValidate){
		postTaskForm(null);
	}
}
function submitTaskFormActivity(){
	var passValidate = true;
	passValidate = validateTaskActivityForm();

	if(passValidate){
		postTaskFormActivity(null);
	}
}
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
		var file = $(elem).closest('.fileinput');
		file.fileinput('clear');
		if(file.next().hasClass('fileinput-last')){
			file.next().remove();
			file.addClass('fileinput-last');
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
		var bpkDataTableBorrow=$('#borrow-datatable').DataTable({
			"bFilter": false,
			"responsive": true,
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
						return '<a href="'+borrowViewUrl+'/'+full.wsitem_borrow_id+'" target="_blank" class="btn btn-primary" rel="tooltip" data-title="ดูรายละเอียด"><i class="glyphicon glyphicon-search"></i></a>';
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
		bpkDataTableTaskActivity=$('#task-activity-datatable').DataTable({
			"bFilter": false,
			"responsive": true,
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
		var bpkDataTableProject=$('#project-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
							return '<span class="label label-danger">'+full.request_priority_detail+'</span>';
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
						return '<a target="_blank" href="'+projectViewUrl+'/'+full.project_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
					}
				},
	      { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="onSelectDataTableRow_Project(\''+full.project_id+'\',\''+full.title+'\')" class="btn btn-primary" rel="tooltip" data-title="Select"><i class="glyphicon glyphicon-ok"></i></a>';
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
		bpkDataTable=$('#select-template').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
						return '<a target="_blank" href="'+templateViewUrl+'/'+full.template_project_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
					}
				},
	             { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="onSelectDataTableRow_Template(\''+full.template_project_id+'\',\''+full.title+'\')" class="btn btn-primary" rel="tooltip" data-title="Select"><i class="glyphicon glyphicon-ok"></i></a>';
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
		bpkDataTable=$('#select-wsitem').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
					return '<a target="_blank" href="'+wsitemViewUrl+'/'+full.wsitem_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="onSelectDataTableRow_WsItem(\''+full.itemtype_detail+'\',\''+full.wsitem_id+'\',\''+full.brand+'\',\''+full.serial+'\',\''+full.ws_id+'\',\''+full.model+'\',\''+full.section_detail+'\',\''+full.hos_detail+'\')" class="btn btn-primary" rel="tooltip" data-title="Select"><i class="glyphicon glyphicon-ok"></i></a>';
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

		bpkDataTable=$('#select-employee-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
					return '<a target="_blank" href="'+employeeViewUrl+'/'+full.emp_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
					}
				},
				{ 	"mData" : null , "sClass": "center",
				"mRender": function ( data, type, full ) {
				return '<a href="#" onclick="onSelectDataTableRow_Employee(\''+full.emp_id+'\',\''+full.ename+' '+full.esurname+'\',\''+full.hos_detail+'\',\''+full.section_detail+'\',\''+full.position+'\',\''+full.section_id+'\')" class="btn btn-primary" rel="tooltip" data-title="Select"><i class="glyphicon glyphicon-ok"></i></a>';
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
		var bpkDataTableTemplateTask=$('#template-task-datatable').DataTable({
			"bFilter": false,
			"responsive": true,
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
						return '<a target="_blank" href="'+templateTaskViewUrl+'/'+full.task_id+'" class="btn btn-primary margin-right3" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
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
		var password = $("input[name=inputNewPassword]").val();
		var pattern = /[^a-zA-Z0-9\@\.\_\*\&]/;
		var pattern2 = /[a-zA-Z]/;
		var pattern3 = /[0-9]/;
		var pattern4 = /[\@\.\_\*\&]/;
		if(password.length<8){
			updateInputErrMsg("Password ความยาวต้องไม่น้อยกว่า 8 ตัว",$("input[name=inputNewPassword]"));
			passValidate=false;
		}
		else if(!pattern2.test(password)){
			updateInputErrMsg("Password ต้องประกอบด้วย ตัวอักษรภาษาอังกฤษอย่างน้อย 1 ตัว",$("input[name=inputNewPassword]"));
			passValidate=false;
		}
		else if(!pattern3.test(password)){
			updateInputErrMsg("Password ต้องประกอบด้วย ตัวเลข 1 ตัว",$("input[name=inputNewPassword]"));
			passValidate=false;
		}
		else if(!pattern4.test(password)){
			updateInputErrMsg("Password ต้องประกอบด้วย อักขระพิเศษอย่างน้อย 1 ตัว",$("input[name=inputNewPassword]"));
			passValidate=false;
		}
		else if (pattern.test(password)) {
			updateInputErrMsg("Password ไม่ตรงตามเงื่อนไข",$("input[name=inputNewPassword]"));
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
function loadIframe(iframeName, url) {
    var $iframe = $('#' + iframeName);
    if ( $iframe.length ) {
        $iframe.attr('src',url);    // here you can change src
        return false;
    }
    return true;
}
function openMyIframe(url){
	loadIframe('myIframe','about:blank');
	url+='?session_emp_id='+userEmpId;
	$("#div-back-from-iframe").show();
	// $("#myIframe").show();
	$("#myIframeHolder").show();
	$("#container").hide();
	setTimeout(function(){
		loadIframe('myIframe',url);
	},50);
}
function hideMyIframe(){
	$("#div-back-from-iframe").hide();
	// $("#myIframe").hide();
	$("#myIframeHolder").hide();
	$("#container").show();
}

//mobile-po_waiting_approve
if(viewName=="mobile-po_waiting_approve"){
	$(document).ready(function() {
		onDTCheckboxChangeFunctionPoWaitingApprove=function(){
			var total=0;
			var countChoose=0;
			var dataTable=$("#waiting-approve-po-datatable");
			var nodes =  dataTable.dataTable().fnGetNodes();
			$('.dt-checkbox', nodes).not('.disabled').each(function(){
				if($(this).is(":checked")){
					total+=parseFloat(poWatingApproveDataList[$(this).val()].total_price);
					countChoose++;
				}
				else{
				}
			});

			$("#poWaitApproveItemTotalAmt").val(parseFloat(total).formatMoney(2,'.',','));
			$("#poWaitApproveItemTotalChoose").val(countChoose);
		};

		var bpkDataTableWaitingApprovePo=$('#waiting-approve-po-datatable').DataTable({
			'tabIndex': -1,
			"responsive": true,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {	
						return '<input type="checkbox" name="inputDTCheckbox[]" class="dt-checkbox" value="'+full.po_id+'" />';						
					}
				},
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="openMyIframe(\''+poViewUrl+'/'+full.po_id+'\'); return false;">'+full.po_code+'</a>';
					}
				},
	            { 	"mData" : null, 
					"mRender": function ( data, type, full ) {
						return '-'+nl2br(full.item_list);
					}
				},
	            { 	"mData" : null, 
					"mRender": function ( data, type, full ) {
						return full.distributor_id+' - '+full.distributor_name;
					}
				},
	            { 	"mData" : null,  "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.receive_date!=null){
							return full.receive_date.substring(0,10);
						}
						else return '';
					}
				},
	            { 	"mData" : null,  "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.create_date;
					}
				},
	            { 	"mData" : null,  "sClass": "left",
					"mRender": function ( data, type, full ) {
						return '-'+nl2br(full.pr_code_list);
					}
				},
				{ 	"mData" : null, "sClass": "left",
					"mRender": function ( data, type, full ) {
						return full.department_name;
					}
				},
	            { 	"mData" : null, "sClass": "right",
					"mRender": function ( data, type, full ) {
						return parseFloat(full.total_price).formatMoney(2,'.',',');
					}
				},
				{ 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.is_trade=='T') return 'Trade';
						return 'Non-trade';
					}
				},
				{ 	"mData" : null, "sClass": "left",
					"mRender": function ( data, type, full ) {
						return full.create_by_emp_name;
					}
				},
				{ 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="openMyIframe(\''+poViewUrl+'/'+full.po_id+'\'); return false;" class="btn btn-primary"><i class="glyphicon glyphicon-search"></i></a>';
					}
				}
	        ],
	        "aaSorting": [[ 6, "asc" ]],
			"bProcessing": true,		
			"aaData" : null,
			"fnServerParams": function ( aoData ) {
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings,null,true,'1',getDatatableDataForPoApprove);
				initDTCheckbox('waiting-approve-po-datatable',onDTCheckboxChangeFunctionPoWaitingApprove);
				onDTCheckboxChangeFunctionPoWaitingApprove();
			},
			"iDisplayLength": 10,
			'fixedHeader': true
		});

		getDatatableDataForPoApprove();
		$("#inputShowBelowLevel").click(function(){
			getDatatableDataForPoApprove();
		});
		$("#inputPoWaitApproveHospitalId").change(function(){
			getDatatableDataForPoApprove();
		});
		$("#inputPoWaitApproveIsTrade").change(function(){
			getDatatableDataForPoApprove();
		});
	});
}
//end mobile-po_waiting_approve


//mobile-pr_waiting_approve
if(viewName=="mobile-pr_waiting_approve"){
	$(document).ready(function() {
		var bpkDataTableWaitingApprovePr=$('#waiting-approve-pr-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="openMyIframe(\''+prViewUrl+'/'+full.pr_id+'\'); return false;">'+full.pr_code+'</a>';
						return full.pr_code;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.stock_id;
					}
				},
	            { 	"mData" : null, "sClass": "left",
					"mRender": function ( data, type, full ) {
						return full.stock_name;
					}
				},
	            { 	"mData" : null, 
					"mRender": function ( data, type, full ) {
						return '-'+nl2br(full.item_list);
					}
				},
	            { 	"mData" : null,  "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.create_date;
					}
				},
				{ 	"mData" : null, "sClass": "left",
					"mRender": function ( data, type, full ) {
						return full.create_by_emp_name;
					}
				},
				{ 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="openMyIframe(\''+prViewUrl+'/'+full.pr_id+'\'); return false;" class="btn btn-primary"><i class="glyphicon glyphicon-search"></i></a>';
					}
				}
	        ],
	    "aaSorting": [[ 1, "asc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": purchaseApiBaseUrl+'/pr/waiting_approve',
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
			      // aoData.push( { "name": "branchcode", "value": empHosCode } );
			      aoData.push( { "name": "emp_id", "value": userEmpId } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});
	});
}
//end mobile-pr_waiting_approve


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

		bpkDataTable=$('#admin-select-document-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
					return '<a target="_blank" href="'+documentAdminViewUrl+'/'+full.document_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
					}
				},
				{ 	"mData" : null , "sClass": "center",
				"mRender": function ( data, type, full ) {
				return '<a href="#" onclick="onSelectDataTableRow_Document(\''+full.document_id+'\',\''+full.document_name+'\',\''+full.file_name+'\',\''+full.file_size+'\')" class="btn btn-primary" rel="tooltip" data-title="Select"><i class="glyphicon glyphicon-ok"></i></a>';
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
		bpkDataTable=$('#admin-select-dms-document-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
					return '<a target="_blank" href="'+documentAdminDmsViewUrl+'/'+full.doc_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
					}
				},
				{ 	"mData" : null , "sClass": "center",
				"mRender": function ( data, type, full ) {
				return '<a href="#" onclick="onSelectDataTableRow_DmsDocument(\''+full.doc_id+'\',\''+full.doc_name+'\',\''+full.file_type+'\',\''+full.file_size+'\')" class="btn btn-primary" rel="tooltip" data-title="Select"><i class="glyphicon glyphicon-ok"></i></a>';
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

	$('#import-datatable').DataTable({
		"responsive": true,
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
							return '<span class="label label-danger">'+full.validate+'</span>';
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
	passValidate=checkInputTypeSelect($("select[name=inputSectionId]")) && passValidate;
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
		ajaxGetSectionFromHospital($("#inputEmpHospitalId"),$("#inputSectionId"),null,null);
	});
}
//end admin-employee-add

//admin-employee-edit
function validateAdminEmployeeEditForm(){
	var passValidate=true;
	//check input bottom up
	passValidate=checkInputTypeSelect($("select[name=inputSectionId]")) && passValidate;
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
		ajaxGetSectionFromHospital($("#inputEmpHospitalId"),$("#inputSectionId"),null,null);
	});
	ajaxGetSectionFromHospital($("#inputEmpHospitalId"),$("#inputSectionId"),$("input[name=inputOldSectionId]").val(),null);
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
		bpkDataTable=$('#admin-employee-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
							return '<span class="label label-danger">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+employeeViewUrl+'/'+full.emp_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="'+employeeAdminEditUrl+'/'+full.emp_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="glyphicon glyphicon-wrench"></i></a>';
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
		bpkDataTable=$('#empgroup-emp-datatable').DataTable({
			"bFilter": false,
			"responsive": true,
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
						return '<a target="_blank" href="'+employeeViewUrl+'/'+full.emp_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="deleteEmpToEmpGroup(\''+full.emp_to_emp_group_id+'\',\''+full.ename+' '+full.esurname+'\',$(\'#empgroup-emp-datatable\')); return false;" class="btn btn-primary" rel="tooltip" data-title="Remove"><i class="glyphicon glyphicon-trash"></i></a>';
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
		bpkDataTable=$('#admin-empgroup-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
							return '<span class="label label-danger">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+empGroupAdminEditUrl+'/'+full.emp_group_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="glyphicon glyphicon-wrench"></i></a>';
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
		bpkDataTable=$('#admin-servicetype-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
							return '<span class="label label-danger">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+servicetypeAdminEditUrl+'/'+full.servicetype_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="glyphicon glyphicon-wrench"></i></a>';
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="deleteServiceType(\''+full.servicetype_id+'\',\''+full.detail+'\',$(\'#admin-servicetype-datatable\')); return false;" class="btn btn-danger" rel="tooltip" data-title="ลบ"><i class="glyphicon glyphicon-trash"></i></a>';
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
	passValidate=checkInputTypeSelect($("select[name=inputServiceTypeId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[name=inputSectionId]")) && passValidate;
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
	passValidate=checkInputTypeSelect($("select[name=inputServiceTypeId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[name=inputSectionId]")) && passValidate;
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
		bpkDataTable=$('#admin-service-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
							return '<span class="label label-danger">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+serviceAdminEditUrl+'/'+full.service_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="glyphicon glyphicon-wrench"></i></a>';
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="deleteService(\''+full.service_id+'\',\''+full.service_detail+'\',$(\'#admin-service-datatable\')); return false;" class="btn btn-danger" rel="tooltip" data-title="ลบ"><i class="glyphicon glyphicon-trash"></i></a>';
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
				aoData.push( { "name": "hos_id", "value": $("#inputEmpHospital").val() } );
				aoData.push( { "name": "section_id", "value": $("#inputSectionId").val() } );
				aoData.push( { "name": "isused", "value": $("#inputServiceStatus").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

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
		bpkDataTable=$('#admin-section-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
							return '<span class="label label-danger">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+sectionViewUrl+'/'+full.section_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+sectionAdminEditUrl+'/'+full.section_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="glyphicon glyphicon-wrench"></i></a>';
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="deleteSection(\''+full.section_id+'\',\''+full.section_detail+'\',$(\'#admin-section-datatable\')); return false;" class="btn btn-danger" rel="tooltip" data-title="ลบ"><i class="glyphicon glyphicon-trash"></i></a>';
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
		var bpkDataTableTemplateTask=$('#template-task-datatable').DataTable({
			"bFilter": false,
			"responsive": true,
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
						return '<a target="_blank" href="'+templateTaskViewUrl+'/'+full.task_id+'" class="btn btn-primary margin-right3" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>'
						+'<button onclick="upTemplateTaskOrder(\''+full.task_id+'\',$(\'#template-task-datatable\'));" class="btn '+(full.task_order=="1"?'':'btn-success')+' margin-right3 '+(full.task_order=="1"?'disabled':'')+'" rel="tooltip" data-title="Up"><i class="glyphicon glyphicon-arrow-up"></i></button>'
						+'<button onclick="downTemplateTaskOrder(\''+full.task_id+'\',$(\'#template-task-datatable\'));" class="btn '+(full.is_max_task_order=="1"?'':'btn-danger')+' margin-right3 '+(full.is_max_task_order=="1"?'disabled':'')+'" rel="tooltip" data-title="Down"><i class="glyphicon glyphicon-arrow-down"></i></button>';
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
		bpkDataTable=$('#admin-template-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
							return '<span class="label label-danger">ไม่ใช้งาน</span>';
						}
					}
				},
				{ 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+templateViewUrl+'/'+full.template_project_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
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
	passValidate=checkInputTypeSelect($("select[name=inputSectionId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[name=inputEmpHospitalId]")) && passValidate;
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
	passValidate=checkInputTypeSelect($("select[name=inputSectionId]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[name=inputEmpHospitalId]")) && passValidate;
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
		bpkDataTable=$('#admin-workstation-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
							return '<span class="label label-danger">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+workstationViewUrl+'/'+full.ws_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+workstationAdminEditUrl+'/'+full.ws_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="glyphicon glyphicon-wrench"></i></a>';
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="deleteWorkStation(\''+full.ws_id+'\',\''+full.ws_detail+'\',$(\'#admin-workstation-datatable\')); return false;" class="btn btn-danger" rel="tooltip" data-title="ลบ"><i class="glyphicon glyphicon-trash"></i></a>';
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

		$("#table-workstation-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	};
}
//end admin-workstation


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
		bpkDataTable=$('#admin-itemtype-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
							return '<span class="label label-danger">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+itemtypeAdminEditUrl+'/'+full.itemtype_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="glyphicon glyphicon-wrench"></i></a>';
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="deleteItemType(\''+full.itemtype_id+'\',\''+full.itemtype_detail+'\',$(\'#admin-itemtype-datatable\')); return false;" class="btn btn-danger" rel="tooltip" data-title="ลบ"><i class="glyphicon glyphicon-trash"></i></a>';
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
		bpkDataTable=$('#admin-problemtype-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
							return '<span class="label label-danger">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+problemtypeAdminEditUrl+'/'+full.problemtype_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="glyphicon glyphicon-wrench"></i></a>';
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="deleteProblemType(\''+full.problemtype_id+'\',\''+full.problemtype_detail+'\',$(\'#admin-problemtype-datatable\')); return false;" class="btn btn-danger" rel="tooltip" data-title="ลบ"><i class="glyphicon glyphicon-trash"></i></a>';
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
		bpkDataTable=$('#admin-problemtopic-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
							return '<span class="label label-danger">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+problemtopicAdminEditUrl+'/'+full.problem_topic_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="glyphicon glyphicon-wrench"></i></a>';
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="deleteProblemTopic(\''+full.problem_topic_id+'\',\''+full.problem_topic_detail+'\',$(\'#admin-problemtopic-datatable\')); return false;" class="btn btn-danger" rel="tooltip" data-title="ลบ"><i class="glyphicon glyphicon-trash"></i></a>';
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
	newElem.find("div.fileinput").fileinput('clear');
	newElem.find("input[type=file]").attr("name","inputImage[]");
	newElem.find("input[name^=inputCancelExistingImage]").val('');
	newElem.find("input[name^=inputOldResourceImageId]").val('');
}
function validateAdminWsItemAddForm(){
	var passValidate=true;
	//check input bottom up
	// passValidate=checkInputTypeText($("input[name=inputSerial]")) && passValidate;
	// passValidate=checkInputTypeText($("input[name=inputBrand]")) && passValidate;
	// passValidate=checkInputTypeSelect($("select[id=inputWsId]")) && passValidate;
	// passValidate=checkInputTypeSelect($("select[id=inputSectionId]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputWsItemDetail]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[id=inputHospitalId]")) && passValidate;
	// passValidate=checkInputTypeSelect($("#inputItemTypeId")) && passValidate;
	// passValidate=checkInputTypeText($("input[name=inputWsItemId]")) && passValidate;
	if(passValidate){
		$("#inputAccId").val($.trim($("#inputAccId").val()));
		//if($("#inputGenAccIdBySystem").is(':checked') || $("#inputAccId").val()!=''){
		if(1==1){
			if($("#inputIsLowValue").val()=='F'){
				passValidate=checkInputTypeText($("input[name=inputAssetAge]")) && passValidate;
				passValidate=checkInputTypeText($("input[name=inputScrapAmt]")) && passValidate;
				passValidate=checkInputTypeText($("input[name=inputDocDate]")) && passValidate;
				passValidate=checkInputTypeText($("input[name=inputShopDate]")) && passValidate;
				passValidate=checkInputTypeText($("input[name=inputDpStartDate]")) && passValidate;
				passValidate=checkInputTypeText($("input[name=inputDpAmt]")) && passValidate;
				passValidate=checkInputTypeSelect($("select[id=inputDepartmentRunningId]")) && passValidate;
				passValidate=checkInputTypeSelect($("select[id=inputAssetTypeRunningId]")) && passValidate;
				passValidate=checkInputTypeText($("input[name=inputAccDetail]")) && passValidate;
				if($("input[name=inputDocDate]").val()>'2500-01-01'){
					openModal("fail",'ระบุวันที่ใบสำคัญผิดพลาด',false,null);
					passValidate = false;
				}
				else if($("input[name=inputShopDate]").val()>'2500-01-01'){
					openModal("fail",'ระบุวันที่ซื้อผิดพลาด',false,null);
					passValidate = false;
				}
				else if($("input[name=inputDpStartDate]").val()<$("input[name=inputShopDate]").val()
					|| $("input[name=inputDpStartDate]").val()>'2500-01-01'){
					openModal("fail",'ระบุวันที่เริ่มคิดค่าเสื่อมผิดพลาด',false,null);
					passValidate = false;
				}
				else if(parseInt($("input[name=inputItemCount]").val()) > 100){
					openModal("fail",'ระบุจำนวนผิดพลาด',false,null);
					passValidate = false;
				}
			}
			else{
				passValidate=checkInputTypeText($("input[name=inputShopDate]")) && passValidate;
				
				if(parseInt($("input[name=inputItemCount]").val()) > 100){
					openModal("fail",'ระบุจำนวนผิดพลาด',false,null);
					passValidate = false;
				}

				var shopPrice = $("input[name=inputShopPrice]").val();
				if(shopPrice!='' && (isNaN(parseFloat(shopPrice)) || parseFloat(shopPrice)>=2000)){
					openModal("fail",'ราคาซื้อต้องน้อยกว่า 2,000 บาท',false,null);
					passValidate = false;
				}
			}
		}
	}

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
function wsitemCalDpPercent(age){
	if(!isNaN(age)){
		return parseFloat(100/age).formatMoney(2,'.',',');
	}
	return '';
}
if(viewName=="admin-wsitem-add"){
	if($("#inputIsLowValue").val()=='T'){
		$("#inputDpStartDate").val('');
		$("#inputDpAmt").closest('.form-group').hide();
		$("#inputDpStartDate").closest('.form-group').hide();
		$("#inputAssetAge").closest('.form-group').hide();
		$("#inputCalDpType").closest('.form-group').hide();
		$("#inputParentWsItemId").closest('.form-group').hide();
		$("#inputScrapAmt").closest('.form-group').hide();
		$("#info-caldp").hide();
	}
	$("#inputHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,null,function(){	
			ajaxGetWorkstationFromSection($("#inputSectionId"),$("#inputWsId"),null,null);
		});
	});
	$("#inputSectionId").change(function(){
		ajaxGetWorkstationFromSection($("#inputSectionId"),$("#inputWsId"),null,null);
	});
	$("#inputAssetAge").keyup(function(){
		var percent = wsitemCalDpPercent($(this).val());
		$("#inputDpPercent").val(percent);
	});
	$("#inputDocDate").change(function(){
		var docDate = $(this).val();
		$("#inputShopDate").val(docDate);
		$("#inputDpStartDate:not([disabled])").val(docDate);
		$("#inputBfDate").val(docDate);
	});
	$("#inputGenAccIdBySystem").click(function(){
		if($(this).is(':checked')){
			$("#inputAccId").val('');
		}
	});
	$("#inputAccId").keyup(function(){
		if($(this).val()!=''){
			$("#inputGenAccIdBySystem").prop('checked',false);
		}
	});
	$("select[id=inputAssetTypeRunningId]").change(function(){
		if($("#inputOldAssetAge").val()==''){
			$("#inputAssetAge").val($('option:selected',this).attr('asset-age'));
		}
		$("#inputAssetAge").trigger('keyup');

		var no_dp = $('option:selected',this).attr('no-dp');
		if(no_dp=='T'){
			$("#inputDpAmt").val('0');
		}
		else{
			$("#inputDpAmt").val($("#inputShopPrice").val());
		}

		var cal_dp_type = $('option:selected',this).attr('cal-dp-type');
		$("#inputCalDpType").get(0).selectize.setValue(cal_dp_type);
	});
	$("#inputCalDpType").change(function(){
		var cal_dp_type = $(this).val();
		if(cal_dp_type=='R'){
			$('.asset-age-unit').text('วัน');
		}
		else{
			$('.asset-age-unit').text('ปี');
		}
	});
	$("#inputShopPrice").keyup(function(){
		var no_dp = $('select[id=inputAssetTypeRunningId] option:selected').attr('no-dp');
		if(no_dp!='T'){
			$("#inputDpAmt").val($("#inputShopPrice").val());
		}
	});
	$(function(){
		$("#inputHospitalId").trigger('change');
		$("select[id=inputAssetTypeRunningId]").trigger('change');

	  var paramKeys=new Array();
	  paramKeys.push('hos_id');
	  var paramElems=new Array();
	  paramElems.push("#inputHospitalId");
	  var selectize=initSelectizeRemote2($("#inputParentWsItemId"), 1, 'wsitem_id', 'acc_detail', ['acc_id','acc_detail'],  'acc_id', true, ajaxGetWsItemSelectizeUrl,null,paramKeys,paramElems,null,null,false);
	  selectize=selectize[0].selectize;
	  clearSelectize(selectize);	
	})
}
//end admin-wsitem-add

//admin-wsitem-edit
function validateAdminWsItemEditForm(){
	var passValidate=true;
	//check input bottom up
	// passValidate=checkInputTypeText($("input[name=inputSerial]")) && passValidate;
	// passValidate=checkInputTypeText($("input[name=inputBrand]")) && passValidate;
	// passValidate=checkInputTypeSelect($("select[name=inputWsId]")) && passValidate;
	// passValidate=checkInputTypeSelect($("select[name=inputSectionId]")) && passValidate;
	// passValidate=checkInputTypeSelect($("select[name=inputEmpHospitalId]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputWsItemDetail]")) && passValidate;
	passValidate=checkInputTypeSelect($("select[id=inputHospitalId]")) && passValidate;
	// passValidate=checkInputTypeSelect($("#inputItemTypeId")) && passValidate;
	// passValidate=checkInputTypeText($("input[name=inputWsItemId]")) && passValidate;
	
	if(passValidate){
		$("#inputAccId").val($.trim($("#inputAccId").val()));
		if($("#inputIsLowValue").val()=='F'){
			passValidate=checkInputTypeText($("input[name=inputAssetAge]")) && passValidate;
			passValidate=checkInputTypeText($("input[name=inputScrapAmt]")) && passValidate;
			passValidate=checkInputTypeText($("input[name=inputDocDate]")) && passValidate;
			passValidate=checkInputTypeText($("input[name=inputShopDate]")) && passValidate;
			passValidate=checkInputTypeText($("input[name=inputDpStartDate]")) && passValidate;
			passValidate=checkInputTypeText($("input[name=inputDpAmt]")) && passValidate;
			passValidate=checkInputTypeSelect($("select[id=inputDepartmentRunningId]")) && passValidate;
			passValidate=checkInputTypeSelect($("select[id=inputAssetTypeRunningId]")) && passValidate;
			passValidate=checkInputTypeText($("input[name=inputAccDetail]")) && passValidate;
			if($("input[name=inputDocDate]").val()>'2500-01-01'){
				openModal("fail",'ระบุวันที่ใบสำคัญผิดพลาด',false,null);
				passValidate = false;
			}
			else if($("input[name=inputShopDate]").val()>'2500-01-01'){
				openModal("fail",'ระบุวันที่ซื้อผิดพลาด',false,null);
				passValidate = false;
			}
			else if($("input[name=inputDpStartDate]").val()<$("input[name=inputShopDate]").val()
				|| $("input[name=inputDpStartDate]").val()>'2500-01-01'){
				openModal("fail",'ระบุวันที่เริ่มคิดค่าเสื่อมผิดพลาด',false,null);
				passValidate = false;
			}
		}
		else{
			var shopPrice = $("input[name=inputShopPrice]").val();
			if(shopPrice!='' && (isNaN(parseFloat(shopPrice)) || parseFloat(shopPrice)>=2000)){
				openModal("fail",'ราคาซื้อต้องน้อยกว่า 2,000 บาท',false,null);
				passValidate = false;
			}
		}
	}
	
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
	if($("#inputIsLowValue").val()=='T'){
		$("#inputDpStartDate").val('');
		$("#inputDpAmt").closest('.form-group').hide();
		$("#inputDpStartDate").closest('.form-group').hide();
		$("#inputAssetAge").closest('.form-group').hide();
		$("#inputCalDpType").closest('.form-group').hide();
		$("#inputParentWsItemId").closest('.form-group').hide();
		$("#inputScrapAmt").closest('.form-group').hide();
		$("#info-caldp").hide();
	}
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
	$("#inputAssetAge").keyup(function(){
		var percent = wsitemCalDpPercent($(this).val());
		$("#inputDpPercent").val(percent);
	});
	$("#inputDocDate").change(function(){
		var docDate = $(this).val();
		$("#inputShopDate").val(docDate);
		$("#inputDpStartDate:not([disabled])").val(docDate);
		$("#inputBfDate").val(docDate);
	});
	$("#inputGenAccIdBySystem").click(function(){
		if($(this).is(':checked')){
			$("#inputAccId").val('');
		}
	});
	$("#inputAccId").keyup(function(){
		if($(this).val()!=''){
			$("#inputGenAccIdBySystem").prop('checked',false);
		}
	});
	$("select[id=inputAssetTypeRunningId]").change(function(){
		if($("#inputOldAssetAge").val()==''){
			$("#inputAssetAge").val($('option:selected',this).attr('asset-age'));
		}
		$("#inputAssetAge").trigger('keyup');

		var no_dp = $('option:selected',this).attr('no-dp');
		if(no_dp=='T'){
			$("#inputDpAmt").val('0');
		}
		else{
			$("#inputDpAmt").val($("#inputShopPrice").val());
		}

		var cal_dp_type = $('option:selected',this).attr('cal-dp-type');
		$("#inputCalDpType").get(0).selectize.setValue(cal_dp_type);
	});
	$("#inputCalDpType").change(function(){
		var cal_dp_type = $(this).val();
		if(cal_dp_type=='R'){
			$('.asset-age-unit').text('วัน');
		}
		else{
			$('.asset-age-unit').text('ปี');
		}
	});
	$("#inputShopPrice").keyup(function(){
		var no_dp = $('select[id=inputAssetTypeRunningId] option:selected').attr('no-dp');
		if(no_dp!='T'){
			$("#inputDpAmt").val($("#inputShopPrice").val());
		}
	});
	$(function(){
		$("#inputAssetAge").trigger('keyup');
		$("#inputAccId").trigger('keyup');

	  var paramKeys=new Array();
	  paramKeys.push('hos_id');
	  var paramElems=new Array();
	  paramElems.push("#inputHospitalId");
	  var selectize=initSelectizeRemote2($("#inputParentWsItemId"), 1, 'wsitem_id', 'acc_detail', ['acc_id','acc_detail'],  'acc_id', true, ajaxGetWsItemSelectizeUrl,null,paramKeys,paramElems,null,null,false);
	  selectize=selectize[0].selectize;
	  clearSelectize(selectize);
	  if(wsItemData.parent_wsitem_id!=null){
	  	selectize.addOption([{'wsitem_id':wsItemData.parent_wsitem_id, 'acc_id':wsItemData.parent_acc_id, 'acc_detail':(wsItemData.parent_acc_detail==null?'':wsItemData.parent_acc_detail)}]);
			selectize.setValue(wsItemData.parent_wsitem_id);
	  }
	})
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
			"responsive": true,
			"searchDelay": sSearchDelay,
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
							return '<span class="label label-danger">ไม่ใช้งาน</span>';
						}
					}
				}, { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.can_borrow=='T'){
							return '<span class="label label-success">ยืมได้</span>';
						}
						else{
							return '<span class="label label-danger">ยืมไม่ได้</span>';
						}
					}
				},
				{ 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+wsitemViewUrl+'/'+full.wsitem_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
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
			"responsive": true,
			"searchDelay": sSearchDelay,
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
		bpkDataTable=$('#admin-document_type-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
							return '<span class="label label-danger">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+document_typeAdminEditUrl+'/'+full.document_type_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="glyphicon glyphicon-wrench"></i></a>';
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="deleteDocumentType(\''+full.document_type_id+'\',\''+full.detail+'\',$(\'#admin-document_type-datatable\')); return false;" class="btn btn-danger" rel="tooltip" data-title="ลบ"><i class="glyphicon glyphicon-trash"></i></a>';
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
		bpkDataTable=$('#admin-document-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
							return '<span class="label label-danger">ไม่ใช้งาน</span>';
						}
					}
				},
	      { "mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
					return '<a target="_blank" href="'+documentAdminEditUrl+'/'+full.document_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="glyphicon glyphicon-wrench"></i></a>';
					}
				},
	      { "mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
					return '<a target="_blank" href="'+documentAdminViewUrl+'/'+full.document_id+'" class="btn btn-primary" rel="tooltip" data-title="View"><i class="glyphicon glyphicon-search"></i></a>';
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
		bpkDataTable=$('#admin-news_type-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
							return '<span class="label label-danger">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+news_typeAdminEditUrl+'/'+full.news_type_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="glyphicon glyphicon-wrench"></i></a>';
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a href="#" onclick="deleteNewsType(\''+full.news_type_id+'\',\''+full.detail+'\',$(\'#admin-news_type-datatable\')); return false;" class="btn btn-danger" rel="tooltip" data-title="ลบ"><i class="glyphicon glyphicon-trash"></i></a>';
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

		$("#table-news_type-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	};
}
//end admin-news_type


//admin-ior_master-add
function validateAdminIorMasterAddForm(){
	var passValidate=true;

	$("input[name=inputIorCode]").val($.trim($("input[name=inputIorCode]").val()));
	$("input[name=inputIorName]").val($.trim($("input[name=inputIorName]").val()));

	//check input bottom up
	passValidate=checkInputTypeSelect($("select#inputIorTopicId")) && passValidate;
	passValidate=checkInputTypeSelect($("select#inputIorRiskProgramId")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputIorName]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputIorCode]")) && passValidate;

	if(passValidate){
		$.ajax({
		  type: 'POST',
		  url: ajaxIsIorMasterCodeExistUrl,
		  data: {"ior_code":$("input[name=inputIorCode]").val()},
		  success: function(data) {
				if(data.exist){
					updateInputErrMsg($("input[name=inputIorCode]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputIorCode]"));
					passValidate=false;
				}
			},
		  dataType: "json",
		  async:false
		});
	}

	if(passValidate){
		$.ajax({
		  type: 'POST',
		  url: ajaxIsIorMasterNameExistUrl,
		  data: {"ior_name":$("input[name=inputIorName]").val()},
		  success: function(data) {
				if(data.exist){
					updateInputErrMsg($("input[name=inputIorName]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputIorName]"));
					passValidate=false;
				}
			},
		  dataType: "json",
		  async:false
		});
	}

	return passValidate;
}
if(viewName=="admin-ior_master-add"){
	iorMasterInitIorRiskProgram();
	iorMasterInitIorTopic();
	$('#inputHosEffect').selectize({
	    create: true
	});
}
//end admin-ior_master-add

//admin-ior_master-edit
function validateAdminIorMasterEditForm(){
	var passValidate=true;

	$("input[name=inputIorCode]").val($.trim($("input[name=inputIorCode]").val()));
	$("input[name=inputIorName]").val($.trim($("input[name=inputIorName]").val()));

	//check input bottom up
	passValidate=checkInputTypeSelect($("select#inputIorTopicId")) && passValidate;
	passValidate=checkInputTypeSelect($("select#inputIorRiskProgramId")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputIorName]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputIorCode]")) && passValidate;

	if(passValidate && $("input[name=inputIorCode]").val()!=$("input[name=inputOldIorCode]").val()){
		$.ajax({
		  type: 'POST',
		  url: ajaxIsIorMasterCodeExistUrl,
		  data: {"ior_code":$("input[name=inputIorCode]").val()},
		  success: function(data) {
				if(data.exist){
					updateInputErrMsg($("input[name=inputIorCode]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputIorCode]"));
					passValidate=false;
				}
			},
		  dataType: "json",
		  async:false
		});
	}

	if(passValidate && $("input[name=inputIorName]").val()!=$("input[name=inputOldIorName]").val()){
		$.ajax({
		  type: 'POST',
		  url: ajaxIsIorMasterNameExistUrl,
		  data: {"ior_name":$("input[name=inputIorName]").val()},
		  success: function(data) {
				if(data.exist){
					updateInputErrMsg($("input[name=inputIorName]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputIorName]"));
					passValidate=false;
				}
			},
		  dataType: "json",
		  async:false
		});
	}
	return passValidate;
}
function iorMasterOnChangeIorRiskProgram(selectedText,selectedValue,param1,selectedObject){
	if(selectedObject!=null){
		$("#inputIorClinical").val(selectedObject.ior_clinical);
	}
	else{
	}
	var selectize = $("#inputIorTopicId").get(0).selectize;
	clearSelectize(selectize);
}
function iorMasterOnChangeIorTopic(selectedText,selectedValue,param1,selectedObject){
	if(selectedObject!=null){
	}
	else{
	}
}
function iorMasterInitIorTopic(){
	var paramKeys=new Array();
	paramKeys.push('ior_risk_program_id');
	var paramElems=new Array();
	paramElems.push("#inputIorRiskProgramId");
	var selectize=initSelectizeRemote2($("#inputIorTopicId"), 1, 'ior_topic_id', 'name', ['code','name'],  'code', false, ajaxGetIorTopicSelectizeUrl,'iorMasterOnChangeIorTopic',paramKeys,paramElems,null, null, false);
	selectize=selectize[0].selectize;
	clearSelectize(selectize);
}
function iorMasterInitIorRiskProgram(){
	var selectize=initSelectizeRemote2($("#inputIorRiskProgramId"), 1, 'ior_risk_program_id', 'name', ['name'],  'name', false, ajaxGetIorRiskProgramSelectizeUrl,'iorMasterOnChangeIorRiskProgram',null,null,null, null, false);
	selectize=selectize[0].selectize;
	clearSelectize(selectize);
}
if(viewName=="admin-ior_master-edit"){
	iorMasterInitIorRiskProgram();
	iorMasterInitIorTopic();
	
	$('#inputHosEffect').selectize({
	    create: true
	});

	if(ior_master_data.ior_risk_program_id!=null){
		var selectize = $("#inputIorRiskProgramId").get(0).selectize;
		selectize.addOption([{ior_risk_program_id:ior_master_data.ior_risk_program_id, name:ior_master_data.ior_risk_program_name, ior_clinical:ior_master_data.ior_risk_program_clinical}]);
		selectize.setValue([ior_master_data.ior_risk_program_id]);		
	}	
	if(ior_master_data.ior_topic_id!=null){
		var selectize = $("#inputIorTopicId").get(0).selectize;
		selectize.addOption([{ior_topic_id:ior_master_data.ior_topic_id, code:ior_master_data.ior_topic_code, name:ior_master_data.ior_topic_name}]);
		selectize.setValue([ior_master_data.ior_topic_id]);
	}	

	$("[name='inputSectionId[]']").change(function(){
		var inputSectionId=$(this);
		var inputRequestType=$(this).closest('.box-input-detail').find("[name='inputRequestType[]']");
		var inputServiceType=$(this).closest('.box-input-detail').find("[name='inputServiceType[]']");
		var inputService=$(this).closest('.box-input-detail').find("[name='inputService[]']");
		var inputServicePoint=$(this).closest('.box-input-detail').find("#inputServicePoint");
		ajaxGetServiceType(inputRequestType,inputSectionId,inputServiceType,null,'T',function(){
			ajaxGetService(inputServiceType,inputService,null,'T');
		});
		ajaxGetServicePoint(inputSectionId,inputServicePoint,null,'T');
	});

	$("[name='inputRequestType[]']").change(function(){
		var inputRequestType=$(this);
		var inputSectionId=$(this).closest('.box-input-detail').find("[name='inputSectionId[]']");
		var inputServiceType=$(this).closest('.box-input-detail').find("[name='inputServiceType[]']");
		var inputService=$(this).closest('.box-input-detail').find("[name='inputService[]']");
		ajaxGetServiceType(inputRequestType,inputSectionId,inputServiceType,null,'T',function(){
			ajaxGetService(inputServiceType,inputService,null,'T');
		});
	});
	$("[name='inputServiceType[]']").change(function(){
		var inputServiceType=$(this);
		var inputService=$(this).closest('.box-input-detail').find("[name='inputService[]']");
		ajaxGetService(inputServiceType,inputService,null,'T');
	});

	$("[name='inputHospitalId[]']").each(function(){
		var inputHospitalId=$(this);
		var inputSectionId=$(this).closest('.box-input-detail').find("[name='inputSectionId[]']");
		var inputRequestType=$(this).closest('.box-input-detail').find("[name='inputRequestType[]']");
		var inputServiceType=$(this).closest('.box-input-detail').find("[name='inputServiceType[]']");
		var inputService=$(this).closest('.box-input-detail').find("[name='inputService[]']");
		var inputServicePoint=$(this).closest('.box-input-detail').find("#inputServicePoint");
		var selectedSectionId=$(this).closest('.box-input-detail').find(".selectedSectionId").val();
		var selectedServiceTypeId=$(this).closest('.box-input-detail').find(".selectedServiceTypeId").val();
		var selectedServiceId=$(this).closest('.box-input-detail').find(".selectedServiceId").val();
		var selectedServicePointId=$(this).closest('.box-input-detail').find(".selectedServicePointId").val();
		if(selectedSectionId==""){
			selectedSectionId=null;
			ajaxGetSectionFromHospital(inputHospitalId,inputSectionId,selectedSectionId,'T',function(){
			});
		}
		else{
			ajaxGetSectionFromHospital(inputHospitalId,inputSectionId,selectedSectionId,'T',function(){
				ajaxGetServiceType(inputRequestType,inputSectionId,inputServiceType,selectedServiceTypeId,'T',function(){
					ajaxGetService(inputServiceType,inputService,selectedServiceId,'T');
				});

				ajaxGetServicePoint(inputSectionId,inputServicePoint,selectedServicePointId,'T');
			});
		}
	});
	
	setTimeout(function(){
		$("#inputIorName").focus();
	},500);
}
//end admin-ior_master-edit

//admin-ior_master
function enableIorMaster(ior_master_id,dataTable){
	showPageLoading();
	$.post(ior_masterAdminEnableUrl, {"ior_master_id":ior_master_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ข้อมูลที่เลือกถูกเปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function disableIorMaster(ior_master_id,dataTable){
	showPageLoading();
	$.post(ior_masterAdminDisableUrl, {"ior_master_id":ior_master_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ข้อมูลที่เลือกถูกปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function deleteIorMaster(ior_master_id,ior_master_detail,dataTable){
	openModal("ยืนยันการลบ","ยืนยันการลบข้อมูล "+ior_master_detail+"?",true,function(){
		showPageLoading();
		$.post(ior_masterAdminDeleteUrl, {"ior_master_id":ior_master_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","ข้อมูลถูกลบเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
if(viewName=="admin-ior_master-index"){
	$(function(){
		bpkDataTable=$('#admin-ior_master-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,"sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.ior_code;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.ior_name;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.ior_risk_program_name;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.ior_topic_code+"-"+full.ior_topic_name;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.ior_trigger;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.ior_risk_program_clinical;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.jci_standard;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.ior_sentinel;
					}
				},
	     	{ "mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.isused=='T'){
							return '<span class="label label-success">ใช้งาน</span>';
						}
						else{
							return '<span class="label label-danger">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+ior_masterAdminEditUrl+'/'+full.ior_master_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="glyphicon glyphicon-wrench"></i></a>';
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
			            	returnHtml+='<a href="#" onclick="disableIorMaster(\''+full.ior_master_id+'\',$(\'#admin-ior_master-datatable\').DataTable()); return false;"><span>ไม่ใช้งาน</span></a>';
			            }
			            else{
			            	returnHtml+='<a href="#" onclick="enableIorMaster(\''+full.ior_master_id+'\',$(\'#admin-ior_master-datatable\').DataTable()); return false;"><span>ใช้งาน</span></a>';
			            }
			            returnHtml+='<a href="#" onclick="deleteIorMaster(\''+full.ior_master_id+'\',\''+full.ior_name+'\',$(\'#admin-ior_master-datatable\').DataTable()); return false;"><span>ลบ</span></a>';
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
        aoData = getFnServerParams(aoData,$("#form-search"));
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		$("#table-ior_master-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	});
}
//end admin-ior_master


//admin-ior_location-add
function validateAdminIorLocationAddForm(){
	var passValidate=true;

	$("input[name=inputLocationName]").val($.trim($("input[name=inputLocationName]").val()));

	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputLocationName]")) && passValidate;

	if(passValidate){
		$.ajax({
		  type: 'POST',
		  url: ajaxIsIorLocationNameExistUrl,
		  data: {"location_name":$("input[name=inputLocationName]").val()},
		  success: function(data) {
				if(data.exist){
					updateInputErrMsg($("input[name=inputLocationName]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputLocationName]"));
					passValidate=false;
				}
			},
		  dataType: "json",
		  async:false
		});
	}

	return passValidate;
}
if(viewName=="admin-ior_location-add"){
	$("#inputHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,'T',function(){
		});
	});
}
//end admin-ior_location-add

//admin-ior_location-edit
function validateAdminIorLocationEditForm(){
	var passValidate=true;

	$("input[name=inputLocationName]").val($.trim($("input[name=inputLocationName]").val()));

	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputLocationName]")) && passValidate;

	if(passValidate && $("input[name=inputLocationName]").val()!=$("input[name=inputOldLocationName]").val()){
		$.ajax({
		  type: 'POST',
		  url: ajaxIsIorLocationNameExistUrl,
		  data: {"location_name":$("input[name=inputLocationName]").val()},
		  success: function(data) {
				if(data.exist){
					updateInputErrMsg($("input[name=inputLocationName]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputLocationName]"));
					passValidate=false;
				}
			},
		  dataType: "json",
		  async:false
		});
	}
	return passValidate;
}
if(viewName=="admin-ior_location-edit"){
	$("#inputHospitalId").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),null,null);
	});
	ajaxGetSectionFromHospital($("#inputHospitalId"),$("#inputSectionId"),$("input[name=inputOldSectionId]").val(),null,null);
}
//end admin-ior_location-edit

//admin-ior_location
function enableIorLocation(ior_location_id,dataTable){
	showPageLoading();
	$.post(ior_locationAdminEnableUrl, {"ior_location_id":ior_location_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ข้อมูลที่เลือกถูกเปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function disableIorLocation(ior_location_id,dataTable){
	showPageLoading();
	$.post(ior_locationAdminDisableUrl, {"ior_location_id":ior_location_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ข้อมูลที่เลือกถูกปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function deleteIorLocation(ior_location_id,ior_location_detail,dataTable){
	openModal("ยืนยันการลบ","ยืนยันการลบข้อมูล "+ior_location_detail+"?",true,function(){
		showPageLoading();
		$.post(ior_locationAdminDeleteUrl, {"ior_location_id":ior_location_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","ข้อมูลถูกลบเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
if(viewName=="admin-ior_location-index"){
	$(function(){
		bpkDataTable=$('#admin-ior_location-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.location_name;
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
						return full.opd;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.ipd;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.utilities;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.location_header;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.location_header2;
					}
				},
	     	{ "mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.isused=='T'){
							return '<span class="label label-success">ใช้งาน</span>';
						}
						else{
							return '<span class="label label-danger">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+ior_locationAdminEditUrl+'/'+full.ior_location_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="glyphicon glyphicon-wrench"></i></a>';
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
			            	returnHtml+='<a href="#" onclick="disableIorLocation(\''+full.ior_location_id+'\',$(\'#admin-ior_location-datatable\').DataTable()); return false;"><span>ไม่ใช้งาน</span></a>';
			            }
			            else{
			            	returnHtml+='<a href="#" onclick="enableIorLocation(\''+full.ior_location_id+'\',$(\'#admin-ior_location-datatable\').DataTable()); return false;"><span>ใช้งาน</span></a>';
			            }
			            returnHtml+='<a href="#" onclick="deleteIorLocation(\''+full.ior_location_id+'\',\''+full.location_name+'\',$(\'#admin-ior_location-datatable\').DataTable()); return false;"><span>ลบ</span></a>';
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
	      aoData.push( { "name": "location_name", "value": $("#inputLocationName").val() } );
				aoData.push( { "name": "hos_id", "value": $("#inputHospitalId").val() } );
	      aoData.push( { "name": "opd", "value": $("#inputOpd").val() } );
	      aoData.push( { "name": "ipd", "value": $("#inputIpd").val() } );
	      aoData.push( { "name": "utilities", "value": $("#inputUtilities").val() } );
	      aoData.push( { "name": "location_header", "value": $("#inputLocationHeader").val() } );
	      aoData.push( { "name": "location_header2", "value": $("#inputLocationHeader2").val() } );
				aoData.push( { "name": "isused", "value": $("#inputIsused").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		$("#table-ior_location-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	});
}
//end admin-ior_location


//admin-ior_risk_program-add
function validateAdminIorRiskProgramAddForm(){
	var passValidate=true;

	$("input[name=inputName]").val($.trim($("input[name=inputName]").val()));

	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputName]")) && passValidate;

	if(passValidate){
		$.ajax({
		  type: 'POST',
		  url: ajaxIsIorRiskProgramNameExistUrl,
		  data: {"name":$("input[name=inputName]").val()},
		  success: function(data) {
				if(data.exist){
					updateInputErrMsg($("input[name=inputName]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputName]"));
					passValidate=false;
				}
			},
		  dataType: "json",
		  async:false
		});
	}

	return passValidate;
}
if(viewName=="admin-ior_risk_program-add"){
}
//end admin-ior_risk_program-add

//admin-ior_risk_program-edit
function validateAdminIorRiskProgramEditForm(){
	var passValidate=true;

	$("input[name=inputName]").val($.trim($("input[name=inputName]").val()));

	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputName]")) && passValidate;

	if(passValidate && $("input[name=inputName]").val()!=$("input[name=inputOldName]").val()){
		$.ajax({
		  type: 'POST',
		  url: ajaxIsIorRiskProgramNameExistUrl,
		  data: {"name":$("input[name=inputName]").val()},
		  success: function(data) {
				if(data.exist){
					updateInputErrMsg($("input[name=inputName]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputName]"));
					passValidate=false;
				}
			},
		  dataType: "json",
		  async:false
		});
	}
	return passValidate;
}
if(viewName=="admin-ior_risk_program-edit"){
}
//end admin-ior_risk_program-edit

//admin-ior_risk_program
function enableIorRiskProgram(ior_risk_program_id,dataTable){
	showPageLoading();
	$.post(ior_risk_programAdminEnableUrl, {"ior_risk_program_id":ior_risk_program_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ข้อมูลที่เลือกถูกเปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function disableIorRiskProgram(ior_risk_program_id,dataTable){
	showPageLoading();
	$.post(ior_risk_programAdminDisableUrl, {"ior_risk_program_id":ior_risk_program_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ข้อมูลที่เลือกถูกปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function deleteIorRiskProgram(ior_risk_program_id,ior_risk_program_detail,dataTable){
	openModal("ยืนยันการลบ","ยืนยันการลบข้อมูล "+ior_risk_program_detail+"?",true,function(){
		showPageLoading();
		$.post(ior_risk_programAdminDeleteUrl, {"ior_risk_program_id":ior_risk_program_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","ข้อมูลถูกลบเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
if(viewName=="admin-ior_risk_program-index"){
	$(function(){
		bpkDataTable=$('#admin-ior_risk_program-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.name;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.ior_clinical;
					}
				},
	     	{ "mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.isused=='T'){
							return '<span class="label label-success">ใช้งาน</span>';
						}
						else{
							return '<span class="label label-danger">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+ior_risk_programAdminEditUrl+'/'+full.ior_risk_program_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="glyphicon glyphicon-wrench"></i></a>';
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
			            	returnHtml+='<a href="#" onclick="disableIorRiskProgram(\''+full.ior_risk_program_id+'\',$(\'#admin-ior_risk_program-datatable\').DataTable()); return false;"><span>ไม่ใช้งาน</span></a>';
			            }
			            else{
			            	returnHtml+='<a href="#" onclick="enableIorRiskProgram(\''+full.ior_risk_program_id+'\',$(\'#admin-ior_risk_program-datatable\').DataTable()); return false;"><span>ใช้งาน</span></a>';
			            }
			            returnHtml+='<a href="#" onclick="deleteIorRiskProgram(\''+full.ior_risk_program_id+'\',\''+full.name+'\',$(\'#admin-ior_risk_program-datatable\').DataTable()); return false;"><span>ลบ</span></a>';
			            returnHtml+='</li>'
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
        aoData = getFnServerParams(aoData,$("#form-search"));
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		$("#table-ior_risk_program-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	});
}
//end admin-ior_risk_program


//admin-ior_topic-add
function validateAdminIorTopicAddForm(){
	var passValidate=true;

	$("input[name=inputCode]").val($.trim($("input[name=inputCode]").val()));
	$("input[name=inputName]").val($.trim($("input[name=inputName]").val()));

	//check input bottom up
	passValidate=checkInputTypeSelect($("#inputIorRiskProgramId")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputName]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputCode]")) && passValidate;

	if(passValidate){
		$.ajax({
		  type: 'POST',
		  url: ajaxIsIorTopicCodeExistUrl,
		  data: {"code":$("input[name=inputCode]").val()},
		  success: function(data) {
				if(data.exist){
					updateInputErrMsg($("input[name=inputCode]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputCode]"));
					passValidate=false;
				}
			},
		  dataType: "json",
		  async:false
		});
	}

	if(passValidate){
		$.ajax({
		  type: 'POST',
		  url: ajaxIsIorTopicNameExistUrl,
		  data: {"name":$("input[name=inputName]").val()},
		  success: function(data) {
				if(data.exist){
					updateInputErrMsg($("input[name=inputName]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputName]"));
					passValidate=false;
				}
			},
		  dataType: "json",
		  async:false
		});
	}

	return passValidate;
}
if(viewName=="admin-ior_topic-add"){
	$("#inputIorRiskProgramId").change(function(){
	});
}
//end admin-ior_topic-add

//admin-ior_topic-edit
function validateAdminIorTopicEditForm(){
	var passValidate=true;

	$("input[name=inputCode]").val($.trim($("input[name=inputCode]").val()));
	$("input[name=inputName]").val($.trim($("input[name=inputName]").val()));

	//check input bottom up
	passValidate=checkInputTypeSelect($("#inputIorRiskProgramId")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputName]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputCode]")) && passValidate;

	if(passValidate && $("input[name=inputCode]").val()!=$("input[name=inputOldCode]").val()){
		$.ajax({
		  type: 'POST',
		  url: ajaxIsIorTopicCodeExistUrl,
		  data: {"code":$("input[name=inputCode]").val()},
		  success: function(data) {
				if(data.exist){
					updateInputErrMsg($("input[name=inputCode]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputCode]"));
					passValidate=false;
				}
			},
		  dataType: "json",
		  async:false
		});
	}

	if(passValidate && $("input[name=inputName]").val()!=$("input[name=inputOldName]").val()){
		$.ajax({
		  type: 'POST',
		  url: ajaxIsIorTopicNameExistUrl,
		  data: {"name":$("input[name=inputName]").val()},
		  success: function(data) {
				if(data.exist){
					updateInputErrMsg($("input[name=inputName]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputName]"));
					passValidate=false;
				}
			},
		  dataType: "json",
		  async:false
		});
	}

	return passValidate;
}
if(viewName=="admin-ior_topic-edit"){
	$("#inputIorRiskProgramId").change(function(){
	});
}
//end admin-ior_topic-edit

//admin-ior_topic
function enableIorTopic(ior_topic_id,dataTable){
	showPageLoading();
	$.post(ior_topicAdminEnableUrl, {"ior_topic_id":ior_topic_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ข้อมูลที่เลือกถูกเปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function disableIorTopic(ior_topic_id,dataTable){
	showPageLoading();
	$.post(ior_topicAdminDisableUrl, {"ior_topic_id":ior_topic_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ข้อมูลที่เลือกถูกปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function deleteIorTopic(ior_topic_id,ior_topic_detail,dataTable){
	openModal("ยืนยันการลบ","ยืนยันการลบข้อมูล "+ior_topic_detail+"?",true,function(){
		showPageLoading();
		$.post(ior_topicAdminDeleteUrl, {"ior_topic_id":ior_topic_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","ข้อมูลถูกลบเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
if(viewName=="admin-ior_topic-index"){
	$(function(){
		bpkDataTable=$('#admin-ior_topic-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.code;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.name;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.ior_risk_program_name;
					}
				},
	            { 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						return full.ior_clinical;
					}
				},
	     	{ "mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.isused=='T'){
							return '<span class="label label-success">ใช้งาน</span>';
						}
						else{
							return '<span class="label label-danger">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+ior_topicAdminEditUrl+'/'+full.ior_topic_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="glyphicon glyphicon-wrench"></i></a>';
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
			            	returnHtml+='<a href="#" onclick="disableIorTopic(\''+full.ior_topic_id+'\',$(\'#admin-ior_topic-datatable\').DataTable()); return false;"><span>ไม่ใช้งาน</span></a>';
			            }
			            else{
			            	returnHtml+='<a href="#" onclick="enableIorTopic(\''+full.ior_topic_id+'\',$(\'#admin-ior_topic-datatable\').DataTable()); return false;"><span>ใช้งาน</span></a>';
			            }
			            returnHtml+='<a href="#" onclick="deleteIorTopic(\''+full.ior_topic_id+'\',\''+full.name+'\',$(\'#admin-ior_topic-datatable\').DataTable()); return false;"><span>ลบ</span></a>';
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
        aoData = getFnServerParams(aoData,$("#form-search"));
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		$("#table-ior_topic-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	});
}
//end admin-ior_topic


//ior_incharge
function validateIorInchargeForm(){
  count=0;
  var validate=0;

  if(validate>0)
    return;
  return true;
}
function editIorInchargeConfirm(){
  var form=$("#editIorInchargeForm");
	$("#inputCountItem",form).val(iorInchargeList.length);
  var urlSubmit=postAdminIorInchargeEditUrl;
  validate = validateIorInchargeForm();
  var options = { 
      target: null,
      type: 'post',
      dataType:  'json',
      url: urlSubmit,
      beforeSubmit:  function(){
        showPageLoading();
      },
      success: function(data){
        hidePageLoading();
        if(data.error!=""){
          openModal("fail",data.error,false,null);
        }
        else{
          openModal("success","บันทึกสำเร็จ",false,null);
        }
      }
  }; 
  if(validate==true){
    form.ajaxSubmit(options);
  }
}
function initIorInchargeTableInput(){
  var dataTable=$("#admin-ior_incharge-datatable");
	var nodes =  dataTable.DataTable().rows({ page: 'current' }).nodes();
  for(var i_node=0;i_node<nodes.length;i_node++){
  	var node = nodes[i_node];
  	var i=$("select[name^='inputEditIorInchargeEmpId_']", node).attr('ind');
  	var data = iorInchargeList[i];

	  $("select[name^='inputEditIorInchargeEmpId_']", node).each(function(){
	  	var ind=$(this).attr('ind');

			var selectize=initSelectizeRemote2(this, 1, 'emp_id', 'emp_name', ['emp_id','emp_name'],  'emp_id', true, ajaxGetEmployeeNameRemoteUrl);
			selectize=selectize[0].selectize;
			clearSelectize(selectize);
			if(data.emp_id!=''){
				selectize.addOption([{emp_id:data.emp_id, emp_name:data.emp_name}]);
				selectize.setValue([data.emp_id]);
			}
	  });
	}
}
function getDatatableDataForIorIncharge(){
	$('#admin-ior_incharge-datatable').dataTable().fnClearTable();
	dataList=new Array();
	$.ajax({
	  type: 'POST',
	  url: dataTableAjaxSourceUrl,
	  data: null,
	  beforeSend: showPageLoading,
	  success: function(data) {
			iorInchargeList=data.aaData;
	  	if(data.aaData.length>0){
	  		for(var i in data.aaData){
	  			data.aaData[i].i=i;
	  			data.aaData[i].no=parseInt(i)+1;  				
	  		}
				var tmpDataList=data.aaData;
				for(var i in tmpDataList){
					dataList[tmpDataList[i].hos_id]=tmpDataList[i];
				}
				$('#admin-ior_incharge-datatable').DataTable().rows.add(data.aaData).draw();
			}
		},
	  dataType: "json",
	  async:true,
	  complete: hidePageLoading
	});	
}
if(viewName=="admin-ior_incharge-index"){
	$(function(){
		var currentDatatableId="admin-ior_incharge-datatable";

		bpkDataTable=$('#'+currentDatatableId).DataTable({
			'tabIndex': -1,
			"responsive": true,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right",
				},
	            { 	"mData" : null, "sClass": "left",
					"mRender": function ( data, type, full ) {
						var html='';
						html+='<input type="hidden" name="inputEditHosId_'+full.no+'" ind="'+full.i+'" value="'+full.hos_id+'">';

						return html+full.hos_detail;
					}
				},
				{ 	"mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						var html='<select class="form-control" style="width:400px;" name="inputEditIorInchargeEmpId_'+full.no+'" ind="'+full.i+'"">'
		                  +'<option value="">ไม่ระบุ</option>'
										+'</select>';
						html+='<input type="hidden" name="inputOldIorInchargeEmpId_'+full.no+'" ind="'+full.i+'" value="'+full.emp_id+'" />';
											
						return html;
					}
				}
	        ],
			"bProcessing": true,
			"bServerSide": false,
			"aaData" : null,
			"bFilter": false,
			"bInfo": false,
			"bPaginate": false,
			"sDom": 'lfrtip',
			"bSort": false,
			"fnServerParams": function ( aoData ) {
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
				initIorInchargeTableInput();
			},
			"iDisplayLength": 50,
			initComplete : function (oSettings) {
		    $(oSettings.nTable).DataTable().buttons().container()
		        .appendTo( '#'+currentDatatableId+'_wrapper div.dataTables_length' );
			},
			'fixedHeader': true
		});

		getDatatableDataForIorIncharge();
	});
}
//end admin-ior_incharge


//admin-division-add
function validateAdminDivisionAddForm(){
	var passValidate=true;

	$("input[name=inputDivisionName]").val($.trim($("input[name=inputDivisionName]").val()));

	//check input bottom up
	passValidate=checkInputTypeSelect($("select[id=inputHospitalId]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputDivisionName]")) && passValidate;

	if(passValidate){
		$.ajax({
		  type: 'POST',
		  url: ajaxIsDivisionNameExistUrl,
		  data: {"division_name":$("input[name=inputDivisionName]").val(),"hos_id":$("#inputHospitalId").val()},
		  success: function(data) {
				if(data.exist){
					updateInputErrMsg($("input[name=inputDivisionName]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputDivisionName]"));
					passValidate=false;
				}
			},
		  dataType: "json",
		  async:false
		});
	}

	return passValidate;
}
if(viewName=="admin-division-add"){
}
//end admin-division-add

//admin-division-edit
function validateAdminDivisionEditForm(){
	var passValidate=true;

	$("input[name=inputDivisionName]").val($.trim($("input[name=inputDivisionName]").val()));

	//check input bottom up
	passValidate=checkInputTypeSelect($("select[id=inputHospitalId]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputDivisionName]")) && passValidate;

	if(passValidate && $("input[name=inputDivisionName]").val()!=$("input[name=inputOldDivisionName]").val()){
		$.ajax({
		  type: 'POST',
		  url: ajaxIsDivisionNameExistUrl,
		  data: {"division_name":$("input[name=inputDivisionName]").val(),"hos_id":$("#inputHospitalId").val()},
		  success: function(data) {
				if(data.exist){
					updateInputErrMsg($("input[name=inputDivisionName]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputDivisionName]"));
					passValidate=false;
				}
			},
		  dataType: "json",
		  async:false
		});
	}
	return passValidate;
}
if(viewName=="admin-division-edit"){
}
//end admin-division-edit

//admin-division
function enableDivision(division_id,dataTable){
	showPageLoading();
	$.post(divisionAdminEnableUrl, {"division_id":division_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ข้อมูลที่เลือกถูกเปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function disableDivision(division_id,dataTable){
	showPageLoading();
	$.post(divisionAdminDisableUrl, {"division_id":division_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ข้อมูลที่เลือกถูกปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function deleteDivision(division_id,division_detail,dataTable){
	openModal("ยืนยันการลบ","ยืนยันการลบข้อมูล "+division_detail+"?",true,function(){
		showPageLoading();
		$.post(divisionAdminDeleteUrl, {"division_id":division_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","ข้อมูลถูกลบเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
if(viewName=="admin-division-index"){
	$(function(){
		bpkDataTable=$('#admin-division-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
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
						return full.name;
					}
				},
	     	{ "mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.isused=='T'){
							return '<span class="label label-success">ใช้งาน</span>';
						}
						else{
							return '<span class="label label-danger">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+divisionAdminEditUrl+'/'+full.division_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="glyphicon glyphicon-wrench"></i></a>';
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
			            	returnHtml+='<a href="#" onclick="disableDivision(\''+full.division_id+'\',$(\'#admin-division-datatable\').DataTable()); return false;"><span>ไม่ใช้งาน</span></a>';
			            }
			            else{
			            	returnHtml+='<a href="#" onclick="enableDivision(\''+full.division_id+'\',$(\'#admin-division-datatable\').DataTable()); return false;"><span>ใช้งาน</span></a>';
			            }
			            returnHtml+='<a href="#" onclick="deleteDivision(\''+full.division_id+'\',\''+full.division_name+'\',$(\'#admin-division-datatable\').DataTable()); return false;"><span>ลบ</span></a>';
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
	      aoData.push( { "name": "name", "value": $("#inputDivisionName").val() } );
				aoData.push( { "name": "hos_id", "value": $("#inputHospitalId").val() } );
				aoData.push( { "name": "isused", "value": $("#inputIsused").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		$("#table-division-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	});
}
//end admin-division


//admin-contract_type-add
function validateAdminContractTypeAddForm(){
	var passValidate=true;

	$("input[name=inputContractTypeCode]").val($.trim($("input[name=inputContractTypeCode]").val()));
	$("input[name=inputContractTypeDetail]").val($.trim($("input[name=inputContractTypeDetail]").val()));

	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputContractTypeDetail]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputContractTypeCode]")) && passValidate;

	if(passValidate){
		$.ajax({
		  type: 'POST',
		  url: ajaxIsContractTypeCodeExistUrl,
		  data: {"code":$("input[name=inputContractTypeCode]").val()},
		  success: function(data) {
				if(data.exist){
					updateInputErrMsg($("input[name=inputContractTypeCode]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputContractTypeCode]"));
					passValidate=false;
				}
			},
		  dataType: "json",
		  async:false
		});
	}

	return passValidate;
}
if(viewName=="admin-contract_type-add"){
}
//end admin-contract_type-add

//admin-contract_type-edit
function validateAdminContractTypeEditForm(){
	var passValidate=true;

	$("input[name=inputContractTypeCode]").val($.trim($("input[name=inputContractTypeCode]").val()));
	$("input[name=inputContractTypeDetail]").val($.trim($("input[name=inputContractTypeDetail]").val()));

	//check input bottom up
	passValidate=checkInputTypeText($("input[name=inputContractTypeDetail]")) && passValidate;
	passValidate=checkInputTypeText($("input[name=inputContractTypeCode]")) && passValidate;

	if(passValidate && $("input[name=inputContractTypeCode]").val()!=$("input[name=inputOldContractTypeCode]").val()){
		$.ajax({
		  type: 'POST',
		  url: ajaxIsContractTypeCodeExistUrl,
		  data: {"code":$("input[name=inputContractTypeCode]").val()},
		  success: function(data) {
				if(data.exist){
					updateInputErrMsg($("input[name=inputContractTypeCode]").val()+" ถูกใช้ไปแล้ว",$("input[name=inputContractTypeCode]"));
					passValidate=false;
				}
			},
		  dataType: "json",
		  async:false
		});
	}
	return passValidate;
}
if(viewName=="admin-contract_type-edit"){
}
//end admin-contract_type-edit

//admin-contract_type
function enableContractType(contract_type_id,dataTable){
	showPageLoading();
	$.post(contractTypeAdminEnableUrl, {"contract_type_id":contract_type_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ข้อมูลที่เลือกถูกเปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function disableContractType(contract_type_id,dataTable){
	showPageLoading();
	$.post(contractTypeAdminDisableUrl, {"contract_type_id":contract_type_id}, function(data) {
		if(data.success=="OK"){
			openModal("success","ข้อมูลที่เลือกถูกปิดการใช้งานเรียบร้อย",false,null);
			bpkDataTableSearchSubmit(dataTable);
		}
		else{
			openModal("fail",null,false,null);
		}
	},"json").always(function() { hidePageLoading(); });
}
function deleteContractType(contract_type_id,contract_type_detail,dataTable){
	openModal("ยืนยันการลบ","ยืนยันการลบข้อมูล "+contract_type_detail+"?",true,function(){
		showPageLoading();
		$.post(contractTypeAdminDeleteUrl, {"contract_type_id":contract_type_id}, function(data) {
			if(data.success=="OK"){
				openModal("success","ข้อมูลถูกลบเรียบร้อย",false,null);
				bpkDataTableSearchSubmit(dataTable);
			}
			else{
				openModal("fail",null,false,null);
			}
		},"json").always(function() { hidePageLoading(); });
	});
}
if(viewName=="admin-contract_type-index"){
	$(function(){
		bpkDataTable=$('#admin-contract_type-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
	            { 	"mData" : null, "sClass": "right" },
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.code;
					}
				},
	            { 	"mData" : null,
					"mRender": function ( data, type, full ) {
						return full.detail;
					}
				},
	     	{ "mData" : null, "sClass": "center",
					"mRender": function ( data, type, full ) {
						if(full.isused=='T'){
							return '<span class="label label-success">ใช้งาน</span>';
						}
						else{
							return '<span class="label label-danger">ไม่ใช้งาน</span>';
						}
					}
				},
	            { 	"mData" : null , "sClass": "center",
					"mRender": function ( data, type, full ) {
						return '<a target="_blank" href="'+contractTypeAdminEditUrl+'/'+full.contract_type_id+'" class="btn btn-primary" rel="tooltip" data-title="Edit"><i class="glyphicon glyphicon-wrench"></i></a>';
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
			            	returnHtml+='<a href="#" onclick="disableContractType(\''+full.contract_type_id+'\',$(\'#admin-contract_type-datatable\').DataTable()); return false;"><span>ไม่ใช้งาน</span></a>';
			            }
			            else{
			            	returnHtml+='<a href="#" onclick="enableContractType(\''+full.contract_type_id+'\',$(\'#admin-contract_type-datatable\').DataTable()); return false;"><span>ใช้งาน</span></a>';
			            }
			            returnHtml+='<a href="#" onclick="deleteContractType(\''+full.contract_type_id+'\',\''+full.code+'\',$(\'#admin-contract_type-datatable\').DataTable()); return false;"><span>ลบ</span></a>';
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
	      aoData.push( { "name": "code", "value": $("#inputContractTypeCode").val() } );
	      aoData.push( { "name": "detail", "value": $("#inputContractTypeDetail").val() } );
				aoData.push( { "name": "isused", "value": $("#inputIsused").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		$("#table-contract_type-submit").click(function(){
			bpkDataTableSearchSubmit();
			return false;
		});
	});
}
//end admin-contract_type


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


//report-news_read
if(viewName=="report-news_read"){
	$("#inputHospitalId_NewsReadBySection").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId_NewsReadBySection"),$("#inputSectionId_NewsReadBySection"),null,'T');
	});

	ajaxGetSectionFromHospital($("#inputHospitalId_NewsReadBySection"),$("#inputSectionId_NewsReadBySection"),null,'',null);

	$("#inputHospitalId_NewsReadByEmp").change(function(){
		ajaxGetSectionFromHospital($("#inputHospitalId_NewsReadByEmp"),$("#inputSectionId_NewsReadByEmp"),null,'T');
	});

	ajaxGetSectionFromHospital($("#inputHospitalId_NewsReadByEmp"),$("#inputSectionId_NewsReadByEmp"),null,'',null);


	$(document).ready(function() {

		var bpkDataTable_NewsRead=$('#news_read-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
        { 	"mData" : null, "sClass": "right" },
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.news_id
				}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.news_name;
				}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.news_type_detail;
				}
				},
				{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
				return full.create_date;
				}
				},
				{ 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
				return full.count_read;
				}
				}
	     ],
	    "aaSorting": [[ 1, "desc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl_NewsRead,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
	      aoData.push( { "name": "news_id", "value": $("#inputNewsId_NewsRead").val() } );
	      aoData.push( { "name": "news_type_id", "value": $("#inputNewsTypeId_NewsRead").val() } );
	      aoData.push( { "name": "news_name", "value": $("#inputNewsName_NewsRead").val() } );
	      aoData.push( { "name": "create_date_start", "value": $("#inputNewsCreateStart_NewsRead").val() } );
	      aoData.push( { "name": "create_date_end", "value": $("#inputNewsCreateEnd_NewsRead").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		$("#table-news_read-submit").click(function(){
			bpkDataTableSearchSubmit(bpkDataTable_NewsRead);
			return false;
		});


		var bpkDataTable_NewsReadBySection=$('#news_read_by_section-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
        { 	"mData" : null, "sClass": "right" },
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.news_id
				}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.news_name;
				}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.news_type_detail;
				}
				},
				{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
				return full.create_date;
				}
				},
				{ 	"mData" : null, "sClass": "left",
				"mRender": function ( data, type, full ) {
				return full.hos_detail;
				}
				},
				{ 	"mData" : null, "sClass": "left",
				"mRender": function ( data, type, full ) {
				return full.section_detail;
				}
				},
				{ 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
				return full.count_read;
				}
				},
				{ 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
				return full.count_unread;
				}
				},
				{ 	"mData" : null, "sClass": "left",
				"mRender": function ( data, type, full ) {
				return full.emp_read_name;
				}
				},
				{ 	"mData" : null, "sClass": "left",
				"mRender": function ( data, type, full ) {
				return full.emp_unread_name;
				}
				}
	     ],
	    "aaSorting": [[ 1, "desc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl_NewsReadBySection,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
	      aoData.push( { "name": "news_id", "value": $("#inputNewsId_NewsReadBySection").val() } );
	      aoData.push( { "name": "news_type_id", "value": $("#inputNewsTypeId_NewsReadBySection").val() } );
	      aoData.push( { "name": "news_name", "value": $("#inputNewsName_NewsReadBySection").val() } );
	      aoData.push( { "name": "create_date_start", "value": $("#inputNewsCreateStart_NewsReadBySection").val() } );
	      aoData.push( { "name": "create_date_end", "value": $("#inputNewsCreateEnd_NewsReadBySection").val() } );
	      aoData.push( { "name": "hos_id", "value": $("#inputHospitalId_NewsReadBySection").val() } );
	      aoData.push( { "name": "section_id", "value": $("#inputSectionId_NewsReadBySection").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		$("#table-news_read_by_section-submit").click(function(){
			if($("#inputSectionId_NewsReadBySection").val()=="" && $("#inputNewsId_NewsReadBySection").val()==""){
				openModal("fail",'กรุณาระบุแผนก หรือ รหัสข่าวสาร',false,null);
			}
			bpkDataTableSearchSubmit(bpkDataTable_NewsReadBySection);
			return false;
		});

		var bpkDataTable_NewsReadByEmp=$('#news_read_by_emp-datatable').DataTable({
			"responsive": true,
			"searchDelay": sSearchDelay,
			"sPaginationType": "full_numbers",
			"aoColumnDefs": dataTableCustomColumnDef,
			"aoColumns": [
        { 	"mData" : null, "sClass": "right" },
				{ 	"mData" : null, "sClass": "left",
				"mRender": function ( data, type, full ) {
				return full.hos_detail;
				}
				},
				{ 	"mData" : null, "sClass": "left",
				"mRender": function ( data, type, full ) {
				return full.section_detail;
				}
				},
				{ 	"mData" : null, "sClass": "left",
				"mRender": function ( data, type, full ) {
				return full.emp_name;
				}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.news_id
				}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.news_name;
				}
				},
				{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
				return full.news_type_detail;
				}
				},
				{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
				return full.create_date;
				}
				},
				{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
					if(full.is_read==1) return 'T';
					else return '';
				}
				}
	     ],
	    "aaSorting": [[ 1, "desc" ]],
			"bProcessing": true,
			"bServerSide": true,
			"sAjaxSource": dataTableAjaxSourceUrl_NewsReadByEmp,
			"sServerMethod": "POST",
			"fnServerParams": function ( aoData ) {
	      aoData.push( { "name": "news_id", "value": $("#inputNewsId_NewsReadByEmp").val() } );
	      aoData.push( { "name": "news_type_id", "value": $("#inputNewsTypeId_NewsReadByEmp").val() } );
	      aoData.push( { "name": "news_name", "value": $("#inputNewsName_NewsReadByEmp").val() } );
	      aoData.push( { "name": "create_date_start", "value": $("#inputNewsCreateStart_NewsReadByEmp").val() } );
	      aoData.push( { "name": "create_date_end", "value": $("#inputNewsCreateEnd_NewsReadByEmp").val() } );
	      aoData.push( { "name": "hos_id", "value": $("#inputHospitalId_NewsReadByEmp").val() } );
	      aoData.push( { "name": "section_id", "value": $("#inputSectionId_NewsReadByEmp").val() } );
	      aoData.push( { "name": "emp_id", "value": $("#inputEmpId_NewsReadByEmp").val() } );
			},
			"fnDrawCallback": function ( oSettings ) {
				bpkDataTableDrawCallback(oSettings);
			}
		});

		$("#table-news_read_by_emp-submit").click(function(){
			if($("#inputEmpId_NewsReadByEmp_typeahead").val()==""){
				$("#inputEmpId_NewsReadByEmp").val('');
			}
			if($("#inputEmpId_NewsReadByEmp").val()=="" && $("#inputNewsId_NewsReadByEmp").val()==""){
				openModal("fail",'กรุณาระบุพนักงาน หรือ รหัสข่าวสาร',false,null);
			}
			bpkDataTableSearchSubmit(bpkDataTable_NewsReadByEmp);
			return false;
		});

	});
}
//end report-news_read


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


//report-asset_dp
function validateReportAssetDpForm(){
	var passValidate=true;
	//check input bottom up
	// passValidate=checkInputTypeDateBetween($("#inputDateStart"),$("#inputDateEnd")) && passValidate;
	return passValidate;
}
if(viewName=="report-asset_dp"){

	var bpkDataTable=$('#report-datatable').DataTable({
		"bFilter": true,
		"responsive": true,
		"searchDelay": sSearchDelay,
		"sPaginationType": "full_numbers",
		"aoColumnDefs": dataTableCustomColumnDef,
		"aoColumns": [
      { 	"mData" : null, "sClass": "right" },
			{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.acc_id;
				}
			},
			{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.asset_type_name;
				}
			},
			{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.acc_detail;
				}
			},
			{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
					return full.shop_date;
				}
			},
            { 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
					return parseFloat(full.shop_p).formatMoney(2,'.',',');
				}
			},
            { 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
					return parseFloat(full.dp_amt).formatMoney(2,'.',',');
				}
			},
            { 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
					return parseFloat(full.last_period_cost).formatMoney(2,'.',',');
				}
			},
            { 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
					return parseFloat(full.dp_percent).formatMoney(2,'.',',');
				}
			},
            { 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
					return parseFloat(full.current_dp_amt).formatMoney(2,'.',',');
				}
			},
            { 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
					return parseFloat(full.bf_dp_amt).formatMoney(2,'.',',');
				}
			},
            { 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
					return parseFloat(full.cf_dp_amt).formatMoney(2,'.',',');
				}
			},
            { 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
					return parseFloat(full.current_period_cost).formatMoney(2,'.',',');
				}
			},
			{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.department_id;
				}
			},
			{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.acccode;
				}
			}
    ],
    "aaSorting": [[ 1, "asc" ]],
		"bProcessing": true,
		"bServerSide": true,
		"sAjaxSource": dataTableAjaxSourceUrl,
		"sServerMethod": "POST",
		"fnServerParams": function ( aoData ) {
      aoData = getFnServerParams(aoData,$("#form-search"));
		},
		"fnDrawCallback": function ( oSettings ) {
			bpkDataTableDrawCallback(oSettings);
			var year = $("#inputMonth").val().substring(0,4);
			var month = parseInt($("#inputMonth").val().substring(5,7));

			var lastPeriodDate = new Date(year,month-1,'0');
			var endPeriodDate = new Date(year,month,'0');
			var lastPeriodDateTxt = moment(lastPeriodDate).format('DD/MM/YYYY')
			var endPeriodDateTxt = moment(endPeriodDate).format('DD/MM/YYYY')
			$("#last-period-cost").text(lastPeriodDateTxt);
			$("#end-period-cost").text(endPeriodDateTxt);
		}
	});
	$("#table-report-index-submit").click(function(){
		bpkDataTableSearchSubmit(bpkDataTable);
		return false;
	});
}
//end report-asset_dp


//report-asset_list
function validateReportAssetListForm(){
	var passValidate=true;
	//check input bottom up
	// passValidate=checkInputTypeDateBetween($("#inputDateStart"),$("#inputDateEnd")) && passValidate;
	return passValidate;
}
if(viewName=="report-asset_list"){

	var bpkDataTable=$('#report-datatable').DataTable({
		"bFilter": true,
		"responsive": false,
		"searchDelay": sSearchDelay,
		"sPaginationType": "full_numbers",
		"aoColumnDefs": dataTableCustomColumnDef,
		"aoColumns": [
      { 	"mData" : null, "sClass": "right" },
			{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.acc_id;
				}
			},
			{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.asset_type_name;
				}
			},
			{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.acc_detail;
				}
			},
			{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
					return full.shop_date;
				}
			},
            { 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
					return parseFloat(full.shop_p).formatMoney(2,'.',',');
				}
			},
            { 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
					return parseFloat(full.dp_amt).formatMoney(2,'.',',');
				}
			},
            { 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
					return parseFloat(full.last_period_cost).formatMoney(2,'.',',');
				}
			},
            { 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
					return parseFloat(full.dp_percent).formatMoney(2,'.',',');
				}
			},
            { 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
					return parseFloat(full.current_dp_amt).formatMoney(2,'.',',');
				}
			},
            { 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
					return parseFloat(full.bf_dp_amt).formatMoney(2,'.',',');
				}
			},
            { 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
					return parseFloat(full.cf_dp_amt).formatMoney(2,'.',',');
				}
			},
            { 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
					return parseFloat(full.current_period_cost).formatMoney(2,'.',',');
				}
			},
			{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.department_id;
				}
			},
			{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.acccode;
				}
			}
    ],
    "aaSorting": [[ 1, "asc" ]],
		"bProcessing": true,
		"bServerSide": true,
		"sAjaxSource": dataTableAjaxSourceUrl,
		"sServerMethod": "POST",
		"fnServerParams": function ( aoData ) {
      aoData = getFnServerParams(aoData,$("#form-search"));
		},
		"fnDrawCallback": function ( oSettings ) {
			bpkDataTableDrawCallback(oSettings);
			var year = $("#inputDate").val().substring(0,4);
			var month = parseInt($("#inputDate").val().substring(5,7));

			var lastPeriodDate = new Date(year,month-1,'0');
			var endPeriodDate = new Date(year,month-1,$("#inputDate").val().substring(8,10));
			var lastPeriodDateTxt = moment(lastPeriodDate).format('DD/MM/YYYY')
			var endPeriodDateTxt = moment(endPeriodDate).format('DD/MM/YYYY')
			$("#last-period-cost").text(lastPeriodDateTxt);
			$("#end-period-cost").text(endPeriodDateTxt);
		}
	});
	$("#table-report-index-submit").click(function(){
		bpkDataTableSearchSubmit(bpkDataTable);
		return false;
	});
}
//end report-asset_list


//report-asset_write_off
function wsItemCancelWriteOff(wsitem_id){
	var confirmText="ยืนยัน";
	openModal(confirmText,confirmText+"?",true,function(){
		$.ajax({
			type: 'POST',
			url: assetCancelWriteOffUrl,
			data:  {'wsitem_id':wsitem_id},
			dataType: "json",
			async:true,
      beforeSubmit:  function(){
        showPageLoading();
      },
			success: function(data) {
	      hidePageLoading();
        if(data.error!=""){
          openModal("fail",data.error,false,null);
        }
        else{
      		openModal("success","บันทึกสำเร็จ",false,null);
      		bpkDataTableSearchSubmit(bpkDataTable);
        }
			}
		});
	});
}
if(viewName=="report-asset_write_off"){

	var bpkDataTable=$('#report-datatable').DataTable({
		"bFilter": true,
		"responsive": false,
		"searchDelay": sSearchDelay,
		"sPaginationType": "full_numbers",
		"aoColumnDefs": dataTableCustomColumnDef,
		"aoColumns": [
      { 	"mData" : null, "sClass": "right" },
			{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.acc_id;
				}
			},
			{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.acc_detail;
				}
			},
			{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.asset_type_name;
				}
			},
			{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
					return full.shop_date;
				}
			},
            { 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
					return parseFloat(full.shop_p).formatMoney(2,'.',',');
				}
			},
            { 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
					return parseFloat(full.dp_amt).formatMoney(2,'.',',');
				}
			},
			{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
					return full.write_off_date;
				}
			},
            { 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
					return parseFloat(full.sell_price).formatMoney(2,'.',',');
				}
			},
            { 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
					return parseFloat(full.acc_dp).formatMoney(2,'.',',');
				}
			},
            { 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
					return parseFloat(full.cost).formatMoney(2,'.',',');
				}
			},
            { 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
					return parseFloat(full.profit_loss).formatMoney(2,'.',',');
				}
			},
			{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.buyer_name;
				}
			},
			{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
					return full.write_off_id;
				}
			},
			{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
					return full.create_date2;
				}
			},
			{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.department_id;
				}
			},
			{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.acccode;
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
		      if(inJSONArray("ASSET_WRITE_OFF",session_app_permission_include) != -1){
          	returnHtml+='<li><a href="#" onclick="wsItemCancelWriteOff(\''+full.wsitem_id+'\'); return false;"><span>ยกเลิกตัดจำหน่าย</span></a></li>';
		      }
          returnHtml+='</ul>'
          	+'</div>';
          return returnHtml;
				}
	    }
    ],
    "aaSorting": [[ 7, "desc" ]],
		"bProcessing": true,
		"bServerSide": true,
		"sAjaxSource": dataTableAjaxSourceUrl,
		"sServerMethod": "POST",
		"fnServerParams": function ( aoData ) {
      aoData = getFnServerParams(aoData,$("#form-search"));
		},
		"fnDrawCallback": function ( oSettings ) {
			bpkDataTableDrawCallback(oSettings);
		},
		"fixedHeader":true
	});
	$("#table-report-index-submit").click(function(){
		bpkDataTableSearchSubmit(bpkDataTable);
		return false;
	});
}
//end report-asset_write_off


//report-asset_buy
if(viewName=="report-asset_buy"){

	var bpkDataTable=$('#report-datatable').DataTable({
		"bFilter": true,
		"responsive": true,
		"searchDelay": sSearchDelay,
		"sPaginationType": "full_numbers",
		"aoColumnDefs": dataTableCustomColumnDef,
		"aoColumns": [
      { 	"mData" : null, "sClass": "right" },
			{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.acc_id;
				}
			},
			{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.acc_detail;
				}
			},
			{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.asset_type_name;
				}
			},
			{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
					return full.shop_date;
				}
			},
            { 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
					return parseFloat(full.shop_p).formatMoney(2,'.',',');
				}
			},
            { 	"mData" : null, "sClass": "right",
				"mRender": function ( data, type, full ) {
					return parseFloat(full.dp_amt).formatMoney(2,'.',',');
				}
			},
			{ 	"mData" : null, "sClass": "left",
				"mRender": function ( data, type, full ) {
					return full.refno;
				}
			},
			{ 	"mData" : null, "sClass": "center",
				"mRender": function ( data, type, full ) {
					if(full.doc_date==null) return '';
					return full.doc_date;
				}
			},
			{ 	"mData" : null, "sClass": "left",
				"mRender": function ( data, type, full ) {
					if(full.shop==null) return '';
					return full.shop;
				}
			},
			{ 	"mData" : null, "sClass": "left",
				"mRender": function ( data, type, full ) {
					if(full.parent_acc_id==null) return '';
					return full.parent_acc_id;
				}
			},
			{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.department_id;
				}
			},
			{ 	"mData" : null,
				"mRender": function ( data, type, full ) {
					return full.acccode;
				}
			}
    ],
    "aaSorting": [[ 1, "asc" ]],
		"bProcessing": true,
		"bServerSide": true,
		"sAjaxSource": dataTableAjaxSourceUrl,
		"sServerMethod": "POST",
		"fnServerParams": function ( aoData ) {
      aoData = getFnServerParams(aoData,$("#form-search"));
		},
		"fnDrawCallback": function ( oSettings ) {
			bpkDataTableDrawCallback(oSettings);
		}
	});
	$("#table-report-index-submit").click(function(){
		bpkDataTableSearchSubmit(bpkDataTable);
		return false;
	});
}
//end report-asset_buy


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

	$("#form-search button[type=reset]").click(function(){
		$("#form-search select.combobox").each(function(){
			clearComboBox($(this));
		})
	});

	var bpk_hd_show_success = $.cookie('bpk_hd_show_success');
	if(bpk_hd_show_success){
    openModal("success","บันทึกสำเร็จ",false,null);
    $.cookie('bpk_hd_show_success', false, { expires: 365 });
  }
});
//end page loading

const state = {

}

const getters = {

}

const actions = {
	sendEvent(store, params) {
		let event_name = params.event_name;
		let recordArr = [];
		let process = (objArr) => {
			let result = null;
			$.each(objArr, function(index, objc) {
				let subProcess = (obj) => {
					let condition = $(obj.$el).is($('div#main_router_view>div'));
					// condition 需要补充 TODO
					if((event_name in obj)) {
						return obj;
					} else {
						if(obj.$children && obj.$children.length) {
							return process(obj.$children);
						}
					}
				};
				result = subProcess(objc);
				if (!!result){
					return false;
				}
			});
			return result;
		}
		let vm = process([window.exportObj]);
		if(!!vm && (event_name in vm)) {
			vm[event_name](params.extra);
		} else {
			console.warn("invalid event '" + event_name + "'");
		}
		return false;
	}
}

const mutations = {

}

export default {
	state,
	getters,
	actions,
	mutations
}
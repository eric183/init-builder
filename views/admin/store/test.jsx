import { observable, action} from 'mobx';

export default class TestStore {
       constructor(tools) {
        //   super(tools);
          this.tools = tools; 
        //   this.testNumber= 0;
       }

       @observable testNumber = 0;

       @action doSomething() {
           this.testNumber = 232323;
       }
} 
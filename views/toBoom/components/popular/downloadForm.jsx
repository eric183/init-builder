import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom'
import {observer} from 'mobx-react';
import { computed, observable, autorun } from 'mobx';
import * as mobx from 'mobx';




@observer
export default class DownloadForm extends React.Component {

        state = {  }

     @computed get get_formState(){ return this.props.store.popularStore.formState }

        checkedFieldValues = ( formState ) =>{
             let { frontChoose, reverseChoose }  = formState;
             if( frontChoose.length <= 0 && reverseChoose.length <= 0 ) return true;
             return false;
        }

        frontBinder = (event) =>{

             let target = event.target,
                 checked = target.checked,
                 formState = mobx.toJS( this.props.store.popularStore.formState );
              if( checked ){
                  formState = Object.assign(formState, { fpngDisable : false, fepsDisable : formState.checkboxSource.front.annex == 1 ? false : true,  front : true })
              }else{
                  formState = Object.assign(formState, { front : false,fepsDisable: true, fpngDisable : true, fpng : false, feps : false, frontChoose : [] })
              }

            this.props.store.popularStore.setProperties({ formState : formState, confirmDisable : this.checkedFieldValues( formState ) })

        }
        
        fItemBinder = (event) =>{
                let target = event.target,
                    value = target.value,
                    checked = target.checked,
                    formState = mobx.toJS( this.props.store.popularStore.formState );
                if( checked ){
                        formState[ 'f' + value ] = true;
                        formState.frontChoose.push( value );
                }else{
                    formState[ 'f' + value ] = false;
                    let index = formState.frontChoose.indexOf( value );
                    index > -1 ? formState.frontChoose.splice(index, 1) : '';
                }
             this.props.store.popularStore.setProperties({ formState : formState, confirmDisable : this.checkedFieldValues( formState ) })
             
        }


    
        reverseBinder = (event) =>{
                let target = event.target,
                    checked = target.checked,
                    formState = mobx.toJS( this.props.store.popularStore.formState );
                        if( checked ){
                            formState = Object.assign(formState, { rpngDisable : false, repsDisable : formState.checkboxSource.reverse.annex == 1 ? false : true, reverse : true } );
                        }else{
                            formState = Object.assign(formState, { reverse : false, repsDisable : true, rpngDisable : true, rpng : false, reps : false, reverseChoose : [] });
                        }  
                    this.props.store.popularStore.setProperties({ formState : formState, confirmDisable : this.checkedFieldValues( formState ) })
              
        }
        rItemBinder = (event) =>{
            let target = event.target,
                value = target.value,
                checked = target.checked,
                formState = mobx.toJS( this.props.store.popularStore.formState );
             if( checked ){
                 formState['r' + value] = true;
                 formState.reverseChoose.push( value );
             }else{
                 formState['r' + value] = false;
                let index = formState.reverseChoose.indexOf( value );
                index > -1 ? formState.reverseChoose.splice(index, 1) : '';
             }
             this.props.store.popularStore.setProperties({ formState : formState, confirmDisable : this.checkedFieldValues( formState ) })
        }

       render(){

    

         let { front,
                fpng, 
                feps, 
                reverse,
                 rpng, reps, 
                 fpngDisable,
                 fepsDisable,
                 rpngDisable,
                 repsDisable
                  } = mobx.toJS( this.get_formState );

            return (
                 <form className="downloadform">
                   <div className="contrl-block">
                      <p> <span>视图：</span> <label><input type="checkbox" name="front" value="front" checked={ front }  onChange={ this.frontBinder }  />正面</label>  </p>
                      <p> <span>文件格式：</span> <label><input type="checkbox" name="front" value="png" checked={ fpng }  disabled={ fpngDisable }   onChange={ this.fItemBinder }   />PNG</label> 
                         <label><input name="front_eps" type="checkbox"  value="eps" disabled={ fepsDisable } checked={ feps  }    onChange={ this.fItemBinder }  />EPS</label> 
                         </p>
                    </div> 

                    <hr/> 

                    <div className="contrl-block">
                      <p> <span>视图：</span> <label><input name="reverse" type="checkbox" checked={ reverse } onChange={ this.reverseBinder }  />反面</label> </p>
                      <p> <span>文件格式：</span> <label><input name="reverse" value="png" type="checkbox" checked={ rpng }  disabled={ rpngDisable } onChange={ this.rItemBinder }  />PNG</label> 
                      <label><input name="reverse" type="checkbox" value="eps" disabled={ repsDisable } checked={ reps }  onChange={ this.rItemBinder }  />EPS</label>
                       </p>
                    </div>  
                 </form>
            )
       }
}


import React from 'react';


export default class ErrorPage extends React.Component {
    backBinder() {
        this.props.history.goBack();

        // var qsInfo = {
        //     userId: 'haha'
        // };
        // this.props.Util.goPath('/supper', qsInfo);
        // console.log(this.props.Util.search());
        // this.props.Util.goPath.call(this, '/supper', qsInfo);

    }
    
    componentDidMount() {
        // console.log(this.props.history);
    }
    
    render(){
        return (
            <div className="common-content error-content">
               <main>
                    <div>
                        <div>
                            <span>404&nbsp;error</span>
                            <span>page&nbsp;not&nbsp;found</span>
                            </div>
                            <svg viewBox='0 0 200 600'>
                            <polygon points='118.302698 8 59.5369448 66.7657528 186.487016 193.715824 14 366.202839 153.491505 505.694344 68.1413353 591.044514 200 591.044514 200 8'></polygon>
                            </svg>
                        </div>
                        <svg className='crack' viewBox='0 0 200 600'>
                            <polyline points='118.302698 8 59.5369448 66.7657528 186.487016 193.715824 14 366.202839 153.491505 505.694344 68.1413353 591.044514'></polyline>
                        </svg>
                        <div>
                            <svg viewBox='0 0 200 600'>
                            <polygon points='118.302698 8 59.5369448 66.7657528 186.487016 193.715824 14 366.202839 153.491505 505.694344 68.1413353 591.044514 0 591.044514 0 8'></polygon>
                            </svg>
                            <div>
                            <span>sorry&nbsp;about&nbsp;that!</span>
                            <span onClick={this.backBinder.bind(this)}>
                                <a>
                                <b>go&nbsp;back?</b>
                                </a>
                            </span>
                        </div>
                    </div>
                </main>

            
                {/* <div classNameName="error">404</div>
                <br /><br />
                <span className="info">File not found ___ 点我回去</span>
                <img src="http://images2.layoutsparks.com/1/160030/too-much-tv-static.gif" className="static" /> */}

            </div>
        )
    }
}
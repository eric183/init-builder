import React from 'react';


export default class Main extends React.Component {

    render() {
        let item = this.props.item
        return (
            <div className='category-item'>
                <div className="lefts">
                    <BigImg  {...this.props} item={item[0]}/>
                    {item[3]?
                        <div>
                            <SmallImg  {...this.props}  item={item[3]}/>
                            {item[4]?<SmallImg  {...this.props}  item={item[4]}/>:''}
                        </div>:''}
                </div>
                <div className="rights">
                    {item[1]?
                        <div>
                            <SmallImg   {...this.props}  item={item[1]}/>
                            {item[2]?<SmallImg  {...this.props}  item={item[2]}/>:''}
                        </div>:''}
                    {item[5]?<BigImg {...this.props}  item={item[5]}/>:''}
                </div>
            </div>
        )
    }
}


function SmallImg(props) {
    return <div className="small"><div className="img"  onClick={ () => { props.handleNextInfo(props.item) } }  ><img  src={props.item.preview} alt=""/></div></div>
}
function BigImg(props) {
    return <div className="big"><div className="img" onClick={ () => { props.handleNextInfo(props.item) } } ><img  src={props.item.preview} alt=""/></div></div>

}
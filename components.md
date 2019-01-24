# 乌托邦通用组件


## Modal

```javascript 
import { Modal } from '@/components/modal';

<Modal 
    title="重命名"
    show={this.state.modalShow}
    onConfirm={this.confirmBinder.bind(this)}
    onCancel={this.cancelBinder.bind(this)}>

    <div className="content">
        你好
    </div>
    
</Modal>

```
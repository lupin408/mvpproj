import React from 'react';

var Mailbox = (props) => (
<div id='fullbox'>
    {props.msgs.map((a) => 
    <div> 
        <span>FROM: {a.sender}</span>
        <div class='encmsgs'>{a.message}</div>
    </div>
    
    )}
</div>
);
export default Mailbox;
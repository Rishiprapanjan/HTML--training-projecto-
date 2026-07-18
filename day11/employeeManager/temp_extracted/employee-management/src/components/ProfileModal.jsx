import React from "react";


function ProfileModal({
    employee,
    close
}){


return(


<div className="modal-overlay">


<div className="profile-modal">


<button

className="close-btn"

onClick={close}

>
✖
</button>




<div className="profile-header">


<div className="big-avatar">

👨‍💼

</div>



<h2>
{employee.name}
</h2>


<p>
{employee.designation}
</p>


</div>





<div className="profile-info">


<div>

<h4>
📧 Email
</h4>

<p>
{employee.email}
</p>

</div>



<div>

<h4>
📞 Phone
</h4>

<p>
{employee.phone}
</p>

</div>



<div>

<h4>
🏢 Department
</h4>

<p>
{employee.department}
</p>

</div>



<div>

<h4>
💼 Experience
</h4>

<p>
{employee.experience || "Not Added"}
</p>

</div>



<div>

<h4>
📅 Joining Date
</h4>

<p>
{employee.joining || "Not Added"}
</p>

</div>



<div>

<h4>
📍 Location
</h4>

<p>
{employee.location || "Not Added"}
</p>

</div>



<div>

<h4>
💰 Salary
</h4>

<p>
₹{employee.salary}
</p>

</div>



<div>

<h4>
Status
</h4>

<p>

{
employee.status==="Active"
?
"🟢 Active"
:
employee.status==="On Leave"
?
"🟡 On Leave"
:
"🔴 Inactive"
}

</p>

</div>



</div>



</div>


</div>


)


}


export default ProfileModal;
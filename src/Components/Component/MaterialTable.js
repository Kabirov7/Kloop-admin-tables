import React, {useEffect, useState} from "react";
import MaterialTable from "material-table";

export default function MTable(props) {


	return (<MaterialTable
		title={props.title}
		columns={props.columns}
		data={props.data}
		cellEditable={{
			onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
				return new Promise((resolve, reject) => {

					const key = Object.keys(rowData)[Object.values(rowData).indexOf(oldValue)]

					props.save_role(rowData.id, key ,newValue)
					setTimeout(resolve, 1);
				});
			}
		}}
		options={{paging: false}}
	/>)
}
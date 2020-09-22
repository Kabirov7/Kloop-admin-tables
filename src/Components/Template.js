import React, {Component, useState} from 'react'
import MaterialTable from "./Component/MaterialTable";
import firebase from "../utils/firebase";

const queryString = require('query-string');

class App extends Component {
	state = {
		main_title: '',
		questions: [],
		columns: [],
		users: [],
		users_data: [],
		users_row: [],
		ready: false
	}

	downloadData = (url) => {
		let urlString = queryString.parse(window.location.search, {decode: false})
		console.log(urlString)
		if (true) {
			fetch(url)
				.then((response) => {
					console.log("RESPONSE", response)
					return response.json();
				})
				.then((data) => {
					console.log("DATA", data);
					this.setState({
						questions: data.questions,
						main_title: data.main_title
					})
					this.columns()
					let usersRef = firebase.firestore().collection('users')
					usersRef.get().then(docs => {
						docs.forEach(doc => this.state.users.push(doc.id))
					}).then(() => {
						let rootRef = firebase.firestore().collection('responses')
						this.state.users.forEach(user => {
							let userRef = rootRef.doc(user)
							let answersRef = userRef.collection("answers")
							answersRef.where("form_name", "==", this.state.main_title).get().then(querySnapshot => {
								querySnapshot.forEach((snap, index) => {
									let row = {}
									let element = snap.data()
									if (element) {
										let keys = Object.keys(this.state.columns)
										// console.log(element.answers)
										let answers = []

		
										this.state.questions.forEach((question, ind) => {
											if (element.answers[ind]) {
												// console.log(ind)
												console.log(question)
												console.log(element.answers[ind])
											}
											if (question.type === 'multiradio') {
												let len = question.subquestion.length
												for (let i = 0; i < len; i++) {
													if (element.answers[ind] && element.answers[ind][i]) {
														answers.push(element.answers[ind][i])
													}
													else {
														answers.push('-')
													}
												}
											}
											else {
												if (element.answers[ind]) {
													answers.push(element.answers[ind])
												}
												else {
													answers.push('-')
												}
											}
										})
										

										console.log(answers)

										keys.forEach(key => {
											if (answers[key]) {
												row[key] = answers[key]
											}
											else {
												row[key] = "-"
											}
										})
										let arr = [...this.state.users_row]
										arr.push(row)
										this.setState({users_row: arr})
										console.log(arr)
									}
								})
							})
						})
					})
				});
		} else {
			console.log("ERROR: no url detected")
		}

	}

	columns() {
		let tmpCols = []

		this.state.questions.forEach((el, i) => {
			if (el.type === 'multiradio') {
				el.subquestion.forEach(subquestion => tmpCols.push({title: subquestion.q, editable: "never"}))
			}
			else {
				tmpCols.push({title: el.title, editable: "never"})
			}
		})
		let cols = tmpCols.map((col, i) => col = {...col, field: i})
		console.log(cols)
		// cols.push({title: 'Date', field: 'date', editable: "never"})
		// cols.push({title: 'Timestamp', field: 'timestamp', editable: "never"})
		this.setState({columns: cols})
	}

	componentDidMount() {
		this.downloadData(this.props.url)
	}

	// rowField() {
	// 	const dataRows = []
	// 	this.state.users_data.map((element, index) => {
	// 		let row = {}
	// 		console.log("ROWFIELD")
	// 		Object.keys(element.answers).forEach(key => {
	// 			row[key] = element.answers[key]
	// 		})
	// 		// row['date'] = element.date
	// 		// row['timestamp'] = element.timestamp
	// 		dataRows[index] = row
	// 	})
	// 	this.setState({users_row: dataRows})
	// }


	render() {
		return (
			<div className="App">
				<button onClick={() => this.setState({ready: true})}>Set ready</button>
				{/* <button onClick={() => console.log(this.state)}>show state</button>
				<button onClick={() => this.columns()}>show sdsaftate</button>
				<button onClick={() => this.rowField()}>show rowField</button> */}
				{this.state.ready ? <MaterialTable columns={this.state.columns} title={this.state.main_title} data={this.state.users_row}/> : null}
			</div>
		);
	};
}

export default App;

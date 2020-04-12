const handleRegister = (req,res,db,bcrypt)=>{
	const { email, password, name} = req.body;
	const hash = bcrypt.hashSync(password);
	if(!email || !password || !name){
		return res.status(400).json('error')
	}
	db.transaction(trx=>{
		trx.insert({
			email: email,
			hash:hash
		})
		.into('login')
		.returning('email')
		.then(loginEmail =>{
			return trx('users')
				.returning('*')
				.insert({
				email: loginEmail[0],
				name: name,
				joined: new Date()
				})
			.then(user => res.json(user[0]))
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => res.status(400).json('register failed'))
}

module.exports={
	handleRegister
}

#this is the python node for the blockbase app

from flask import Flask, request
import requests
import json
import hashlib
import datetime


#object for the database host address
class Database_host:
	def __init__(self):
		self.url=''
		self.lasthash=''
		
	def pin_host(self,host):
	
		#assign url to the received database host
		self.url=host
		
	def updatehash(self,txt):
	
		#assign new last blockchain hash
		self.lasthash=txt
		
class Network:
	def __init__(self):
		self.list=[]
		self.size=0
		
	def add(self,nodes):
		
		#add nodes
		self.list=nodes
		x=0
		for x in self.list:
			x=x+1
			
		self.size=x
		
		
#host object
db=Database_host()
nodes=Network()

#-------------Functions--------------

def irc_nodes(host):
	
	#request all nodes
	req=requests.get("https://blockbase-app-irc-herokuapp.com/nodes"+host)
	
	return json.loads(req)
	
	
def hashing(text):
	
	#this is the hashing function
	text=text.encode()
	hashn=hashlib.sha256(text)
	hashn=hashn.hexdigest()
	
	return hashn


def verify(blockhash,transstring,lasthash):
	
	hash_block=hashing(transstring+lasthash)
	
	if(blockhash==hash_block):
		
		#valid block hash
		return "valid"
		
	else:
		return "invalid"
	

def construct_chain(chain):

	#create the blockchain for this node
	chain=json.loads(chain)
	nhash="nillblock"
	invalid="none"
	for block in chain:
		
		#block[0] is the block hash,block[1] is the transactions list
		check=verify(block[0],block[1],nhash)
		
		if(check=="valid"):
			#valid block
			nhash=block[0]
			db.lasthash=nhash
			
		else:
			invalid="found"
			
	return invalid
	
def share_transact(info):

	#share whatenver info that needs to be sent to all other nodes
	#may it be a transaction or a new block
	
	for node in nodes.list:
		
		#share to this node
		req=requests.post(node+"/transact",data=info)
		
def share_newasset(info):

	#share whatenver info that needs to be sent to all other nodes
	#may it be a transaction or a new block
	
	for node in nodes.list:
		
		#share to this node
		req=requests.post(node+"/newasset",data=info)
		
def share_block(info):

	#share whatenver info that needs to be sent to all other nodes
	#may it be a transaction or a new block
	
	for node in nodes.list:
		
		#share to this node
		req=requests.post(node+"/newblock",data=info)

	
#--------------Flask app request mechanism
	
app=Flask(__name__)

@app.route("/")
def init():
	
	#initialisation of node with database host and node host
	database_host=request.args.get("database","")
	node_host=request.args.get("node","")
	
	db.pin_host(database_host)
	nodes.add(irc_nodes(node_host))
	
	#request a database from the nodes
	i=0
	while(i<nodes.size):
		req=requests.get(node.list[i]+"blockchain")
		res=json.dumps(req.text)
		
		if(res[1]=="chain"):
			#construct the chain
			i=nodes.size
			invalid=construct_chain(res[1])
			
			if(invalid="none"):
				#chain is valid
				req=requests.post(db.url+"blockchain",data=res[1])
				break
			else:
				i=i+1
		else:
			i=i+1
	
	return "done"

@app.route("/userkeys")
def userkeys():
	
	#a user wants his account to be hashed for anomity
	public=request.args.get("public_key","")
	private=request.args.get("private_key","")
	
	public=hashing(public)
	private=hashing(private)
	
	res=json.dumps([public,private])
	
	return res
	
	
@app.route("/history")
def history():
	
	#client wants to know the owner and history of an asset
	
	tag=request.args.get("asset_tag","")
	
	head={'request':'long_history','asset_tag':tag}
	req=requests.post(url,data=head)
	info=json.loads(req.text)
	
	data=[{'number':0,'time':'time','receiver':'owner'}]
	i=1
	for x in info[0]:
		y={'number':i,'time':x[0],'receiver':x[3]}
		data.append(y)
		i=i+1
	
	return json.dumps(data)

@app.route("/newasset")
def add_new():

	#user wants to add a new asset into existance
	time=datetime.datetime.now()
	time=time.strftime("%d-%b-%y %H:%M")
	
	tag=hashing(request.args.get("asset_tag",""))
	trans=hashing(tag)
	rec=request.args.get("receiver","")
	blo="newtag"
	tra=request.args.get("descr","")
	
	#adding the purpose and location
	purp=request.args.get("purpose","")
	loca=request.args.get("location","")
	
	head={'request':'check_trans','asset_tag':tag}
	req=requests.post(url,data=head)
	
	#TODO:check if asset exist in ledger
	det=json.loads(req.text)
	
	if(det[0]=="none"):
		head={'request':'current_trans','timestamp':time,'trans_key':trans,'asset_tag':tag,'receiver':rec,'last_blo':blo,'last_tra':tra,'purp':purp,'loca':loca}
		req=requests.post(url,data=head)
		share_newasset(head)
		
		info=json.loads(req.text)
		return json.dumps(info[0])
		
	else:
		return "trans exist"
	
@app.route("/transact")
def transact():

	#a new transaction has been received
	time=datetime.datetime.now()
	time=time.strftime("%d-%b-%y %H:%M")
	
	tag=request.args.get("asset_tag","")
	sender=request.args.get("sender","")
	rec=request.args.get("receiver","")
	purp=request.args.get("purpose","")
	loca=request.args.get("location","")
	
	#find last block
	head={'request':'retrive','asset_tag':tag}
	req=requests.post(url,data=head)
	
	info=json.loads(req.text)
	if(info[0]==sender):
		blo=info[1]
		tra=info[2]
		trans=hashing(tag+tra)
		#check if transaction already exist
		head={'request':'check_trans','asset_tag':tag}
		req=requests.post(url,data=head)
		det=json.loads(req.text)
		if(det[0]=="none"):
			head={'request':'current_trans','timestamp':time,'trans_key':trans,'asset_tag':tag,'receiver':rec,'last_blo':blo,'last_tra':tra,'purp':purp,'loca':loca}
			req=requests.post(url,data=head)
			share_transact(head)
			
			info=json.loads(req.text)
			return json.dumps(info[0])
			
		else:
			return "trans exist"
				
			
		
	else:
		return "invalid sender"
		

@app.route("/assets_owned")
def myassets():
	
	#a client wants to know all the assets he has
	public_key=request.args.get("public_key","")
	
	head={'request':'assets_owned','public_key':public_key}
	req=requests.post(url,data=head)
	
	info=json.loads(req.text)
	
	data=[{'number':0,'asset_tag':'asset tag','desc':'description'}]
	i=1
	
	for x in info[0]:
		y={'number':i,'asset_tag':x[1],'desc':x[3]}
		i=i+1
		data.append(y)
	
	return json.dumps(data)
	
@app.route("/create_block")
def create_block():
	
	#creating block
	text=request.args.get("hash","")
	text=hashing(text[0])
	
	head={'request':'create_block','hash':text}
	req=requests.post(url,data=head)
	share_newblock(head)
	
	info=json.loads(req.text)
	
	return json.dumps(info[0])
	
@app.route("newblock")
def new_block():

	#received a new block
	blockhash=request.args.get("hash","")
	transstring=request.args.get("trans","")
	
	check=verify(blockhash,transstring,db.lasthash)
	
	if(check="valid"):
		
		#the new block is valid
		req=requests.post(db.url+"/block",data=transstring)
		
		return "done"
		
	else:
		return "rejected"
	
	
	
	


	
	
	























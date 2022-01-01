
#this is the IRC server 
from flask import Flask,request
import requests
import json

app=Flask(__name__)


class Network:

	def __init__(self,nodes):
		self.nodes=[]
		self.size=0
		for node in nodes:
			self.nodes.append(node)
			self.size=self.size+1
		
		#the nodes instance stores the network addresses
		
	def add(self,node):
		self.size=self.size+1
		self.nodes.append(node)
		
	def stringfy_nodes(self):
		
		#need full list of nodes
		return json.dumps(self.nodes)

#the nodes object		
nodes=Network([])
	
@app.route("/nodes")
def nodes():
	
	#device requesting all nodes on the network
	#check if device is network node
	device_type=request.args.get("type","")
	if(device_type=="normal"):
		#normal client device
		return nodes.stringfy_nodes()
		
	else:
		#device is a new node
		#get device host first
		node_host=request.args.get("host","")
		node_list=nodes.stringfy_nodes()
		nodes.add(node_host)
		
		return node_list
		
@app.route("/nonce")
def nonce():

	#received proof of work
	
	nonce=request.get("nonce","")
	
	for node in nodes.nodes:
		
		req=requests.get(node+"/create_block?hash="+nonce)
		
	return "done"
		
	
	
	















	

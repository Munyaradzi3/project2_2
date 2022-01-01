
#this is the program that does do proof of work

import json
import requests
import hashlib


class Proof:
	def __init__(self):
		
		self.nonce=0
		self.last="initallasthash"
		
	def process(self):
		
		#finding the next nonce
		found=0
		while(found==0):
			tab=last+str(self.nonce)
			tab=tab.encode()
			tab=hashlib.sha256(tab)
			tab=hexadigest(tab)
			tab=json.dumps(tab)
			
			#validate
			if(tab[1]+tab[2]+tab[3]=="000"):
				#found valid nonce
				found=1
				self.last=json.loads(tab)
				self.nonce=0
				
			else:
				self.nonce=self.nonce+1
				
		return self.last
		
		

#proof of work object
prf=Proof()
process=0
url="https:blockbase-app-irc-herokuapp.com/nonce?"
while(process==0):
	
	#looping
	nonce=prf.process()
	
	req=requests.get(url+nonce)
	
#loop continues until eternity














		
		

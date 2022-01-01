# project2_2
This the project for my 2.2 semester at the Unirvesity of Zimbabwe. The project is a blockchain system for a supply chain issue.

# Problem Defination
The Zimbabwe Mercantales exchange is a market where agricultural produces are sold bettwen farmers and consumers. The system has
a lot of players that garantee the deals e.g logistics providres, custodians, banks etc. This is a supply chain and apparently they
don't have any technology whatsoever to store records in the supply chain.

# Solution
I built a blockchain system that stores all the records in blocks which are digital ledgers linked together in such a way that any
change in one of the ledgers will corupt the whole chain of the ledgers. This propert garantees the security of records since manipulations
can be noticed quickly. The blockchain can store the records permanently and no one can change them. It is actually a better solution as
compared to using a centralised system.

# System Design
I built APIs for the system. One API is going to be used by nodes as a MySQL database management system and this API is written in PHP.
I also built another API for the general management of the blockchain which i wrote in Python(Flask). I used Javascript(React Native) to
build the mobile native app to be used by clients or nodes. Miners or nodes will host the 2 two APIs for the blockchain and for the
database. Clients connect to random miners from the client app.

# A Munyaradzi Togarepi Engineering.

# Sample screenshots of native app
 1. Login
 
![blockbase-login](https://user-images.githubusercontent.com/62065166/147848656-cc30a4b0-afec-4cb0-91d7-52d8670fb095.png)

2. Search page 
3. 
![blockbase-search](https://user-images.githubusercontent.com/62065166/147848672-681e3e22-d05f-4ed7-bf50-af96c2ffd354.png)


3 Perfoming transactions

![blockbase-transact](https://user-images.githubusercontent.com/62065166/147848680-b42fe90f-f8a4-436f-9d03-074b3b6c1f49.png)

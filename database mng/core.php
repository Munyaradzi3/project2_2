<?php


//this is the database app to used as a storage for blockbase
function add_ledger($conn,$tag,$key,$block,$trans,$desc){

	//a new asset is received and needs to be added into the ledger
	$sql="INSERT INTO ledger(asset_tag,public_key,block_hash,trans_key,descr) VALUES('$tag','$key','$block','$trans','$desc')";
	if($conn->query($sql)==true){
		return "done";
	}
	else{
		return "failed";
	}
}

function update_ledger($conn,$tag,$key,$block,$trans){

	//asset ownership changed
	$sql="UPDATE ledger SET public_key='$key',block_hash='$block',trans_key='$trans' WHERE asset_tag='$tag'";
	if($conn->query($sql)==true){
		return "done";
	}
	else{
		return "failed";
	}

}

function retrive($conn,$tag){

	//want info about an asset
	$sql="SELECT * FROM ledger WHERE asset_tag='$tag'";
	$data=$conn->query($sql);
	
	if($data->num_rows>0){
		while($row=$data->fetch_assoc()){
			$info=array($row["public_key"],$row["block_hash"],$row["trans_key"]);
		}
		
		return $info;
	}
	else{
		return "failed";
	}

}
function myassets($conn,$public_key){

	//want list of assets owned by a pupblic key
	$sql="SELECT * FROM ledger WHERE public_key='$public_key'";
	$data=$conn->query($sql);
	
	if($data->num_rows>0){
		$i=0;
		while($row=$data->fetch_assoc()){
			$info[$i]=array($i+1,$row["asset_tag"],$row["block_hash"],$row["descr"]);
			$i=$i+1;
		}
		
		return $info;
	}
	else{
		return "failed";
	}

}

function add_current($conn,$time,$trans,$tag,$rec,$block,$last_trans,$purp,$loca){

	//add a transaction into current transactions list
	$sql="INSERT INTO current_trans(timestamp,trans_key,asset_tag,receiver,last_block,last_trans,purpose,location) VALUES('$time','$trans','$tag','$rec','$block','$last_trans','$purp','$loca')";
	
	if($conn->query($sql)==true){
		return "done";
	}
	else{
		return "failed";
	}

}

function check_trans($conn,$tag){

	//chech if a transaction already exist in the current trans table
	$sql="SELECT * FROM current_trans WHERE asset_tag='$tag'";
	$data=$conn->query($sql);
	
	if($data->num_rows>0){
		return "exist";
	}
	else{
		return "none";
	}

}

function take_all($conn){

	//take all transactions
	$sql="SELECT * FROM current_trans";
	$data=$conn->query($sql);
	
	if($data->num_rows>0){
		$i=0;
		while($row=$data->fetch_assoc()){
			$info[$i]=array($row["timestamp"],$row["trans_key"],$row["asset_tag"],$row["receiver"],$row["last_block"],$row["last_trans"]);
			$i=$i+1;
		}
		return $info;
	}
	else{
		return "none";
	}

}

function size($conn){

	//check size of current trans
	$sql="SELECT * FROM current_trans";
	$data=$conn->query($sql);
	
	return $data->num_rows;

}

function update_into_ledger($conn,$hash){

	//update ledger by adding new assets if any, and updating owners
	$trans=take_all($conn);
	$size=size($conn);
	$ret="done";
	
	$i=0;
	while($i<$size){
	
		$tag=$trans[$i][2];
		if(retrive($conn,$tag)=="failed"){
			//new asset
			//$trans[i][5] is trans key but since its a new asset it would store desc
			$process=add_ledger($conn,$trans[$i][2],$trans[$i][3],$hash,$trans[$i][1],$trans[$i][5]);
			
			if($process=="failed"){
				$ret="failed";
			}
			
		}
		
		else{
			//$tag,$key,$block,$trans
			//$row["timestamp"],$row["trans_key"],$row["asset_tag"],$row["receiver"],$row["last_block"],$row["last_trans"]
			//asset not new so update
			$process=update_ledger($conn,$trans[$i][2],$trans[$i][3],$hash,$trans[$i][1]);
			
			if($process=="failed"){
				$ret="failed";
			}
		
		}
		
		$i=$i+1;
	
	}
	
	return $ret;

}

function create_block($conn,$hash){

	//creating a new table block
	
	//update assets into the ledger
	$add=update_into_ledger($conn,$hash);
	
	
	$sql="CREATE TABLE $hash SELECT * FROM current_trans";
	
	if($conn->query($sql)==true){
	
		//delete contents of current trans table
		$sql="DELETE FROM current_trans";
		if($conn->query($sql)==true){
			return "done ".$add;
		}
		else{
			return "failed delete ".$add;
		}
	}
	else{
		return "failed create table ".$add;
	}

}


function history($conn,$hash,$trans){

	//retriving an asset's history
	$sql="SELECT * FROM $hash WHERE trans_key='$trans'";
	$data=$conn->query($sql);
	
	if($data->num_rows>0){
		while($row=$data->fetch_assoc()){
			$info=array($row["timestamp"],$row["trans_key"],$row["asset_tag"],$row["receiver"],$row["last_block"],$row["last_trans"],$row["purpose"],$row["location"]);
		}
		
		return $info;
	}
	else{
		return "failed";
	}
}


//creating the database connection, $conn
//Everytime a function is called we reference the $conn object
$servername="localhost";
$username="pqccyshx_munyaradzi";
$dbpassword="@mershcap2035";
$dbname="pqccyshx_blockbase";
	
$conn=new mysqli($servername, $username, $dbpassword, $dbname);
	
if($conn->connect_error){
	die("failed:".$conn->connect_error);
}

$req=$_POST["request"];

if($req=="add_ledger"){

	//add to ledger
	$tag=$_POST["asset_tag"];
	$key=$_POST["public_key"];
	$block=$_POST["block_hash"];
	$trans=$_POST["trans_key"];
	$desc=$_POST["desc"];
	
	$res=add_ledger($conn,$tag,$key,$block,$trans,$desc);
	
	echo json_encode([$res]);

}

else if($req=="update_ledger"){

	//update ledger
	$tag=$_POST["asset_tag"];
	$key=$_POST["public_key"];
	$block=$_POST["block_hash"];
	$trans=$_POST["trans_key"];
	
	$res=update_ledger($conn,$tag,$key,$block,$trans);
	
	echo json_encode([$res]);
	

}

else if($req=="retrive"){

	//retrive asset from ledger
	$tag=$_POST["asset_tag"];
	
	$res=retrive($conn,$tag);
	
	echo json_encode($res);

}

else if($req=="assets_owned"){

	//all assets owned by a key requested
	$key=$_POST["public_key"];
	
	$res=myassets($conn,$key);
	
	echo json_encode([$res]);

}

else if($req=="current_trans"){

	//add a transaction to current transactions
	$time=$_POST["timestamp"];
	$trans=$_POST["trans_key"];
	$tag=$_POST["asset_tag"];
	$rec=$_POST["receiver"];
	$block=$_POST["last_blo"];
	$last_trans=$_POST["last_tra"];
	$purp=$_POST["purp"];
	$loca=$_POST["loca"];
	
	$res=add_current($conn,$time,$trans,$tag,$rec,$block,$last_trans,$purp,$loca);
	
	echo json_encode([$res]);

}

else if($req=="check_trans"){

	//check if a transaction exist in current trans table
	$tag=$_POST["asset_tag"];
	
	$res=check_trans($conn,$tag);
	
	echo json_encode([$res]);

}

else if($req=="take_all"){

	//take all transactions in the current trans array
	$res=take_all($conn);
	
	echo json_encode([$res]);

}

else if($req=="create_block"){

	//create a block
	$hash=$_POST["hash"];
	
	$res=create_block($conn,$hash);
	
	echo json_encode([$res]);

}

else if($req=="history"){

	//retrace the history of an asset
	$tag=$_POST["asset_tag"];
	
	$details=retrive($conn,$tag);
	
	if($details=="none"){
		echo json_encode(["failed"]);
	}
	else{
		$hash=$details[1];
		$trans=$details[2];

		$res=history($conn,$hash,$trans);
	
		echo json_encode([$res]);
	}

}

else{

	//full life span of asset
	$tag=$_GET["asset_tag"];
	
	$details=retrive($conn,$tag);
	
	if($details=="none"){
		echo json_encode(["failed"]);
	}
	else{
		$hash=$details[1];
		$trans=$details[2];
		$end=0;
		$i=0;
		while($end==0){
			$details=history($conn,$hash,$trans);
			$info[$i]=$details;
			$i=$i+1;
			if($details[4]!="newtag"){
				$hash=$details[4];
				$trans=$details[5];
			}
			else{
				$end=1;
			}
		}
		$n=0;
		while($i>0){
		
			$data[$n]=array("number"=>$n,"time"=>$info[$n][0],"receiver"=>$info[$n][3]);
			$n=$n+1;
			$i=$i-1;
		
		}
	
		echo json_encode([$data]);
	}
	
	

}

?>












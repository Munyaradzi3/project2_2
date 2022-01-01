<?php

//this is for all get request

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




$servername="localhost";
$username="pqccyshx_munyaradzi";
$dbpassword="@mershcap2035";
$dbname="pqccyshx_blockbase";
	
$conn=new mysqli($servername, $username, $dbpassword, $dbname);
	
if($conn->connect_error){
	die("failed:".$conn->connect_error);
}

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
		$data[0]=array("number"=>0,"time"=>"date","receiver"=>"Receiver","purpose"=>"Purpose","location"=>"Location");
		$n=0;
		while($i>0){
		
			$data[$n+1]=array("number"=>$n,"time"=>$info[$n][0],"receiver"=>$info[$n][3],"purpose"=>$info[$n][6],"location"=>$info[$n][7]);
			$n=$n+1;
			$i=$i-1;
		
		}
	
		echo json_encode($data);
	}

?>

import React, {useState, useEffect, useCallback, useContext} from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { VotingContext } from '../context/Voter';
import Style from '../styles/allowedVoters.module.css';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';
import { useDropzone } from 'react-dropzone';

const candidateRegistration = () => { 
  const [fileUrl, setFileUrl] = useState(null);
  const [candidateForm, setCandidateForm] = useState({
    name: "",
    address: "",
    position:""
  });

  const router = useRouter();
  const {setCandidate, uploadToIPFSCandidate, candidateArray, getNewCandidate} = useContext(VotingContext);

  const onDrop = useCallback(async (acceptedFil) => {
    const url = await uploadToIPFSCandidate(acceptedFil[0]);
    setFileUrl(url);
  });

  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });
  useEffect(()=>{
    getNewCandidate()
  }, [])

  // JSX 

  return ( 
    <div className={Style.createVoter}>
      <div>
        {fileUrl && (
          <div className={Style.voterInfo}>
            <div className={Style.voterInfo_paragraph}>
              <p>
                Name: <span>&nbps; {candidateForm.name}</span>
              </p>
              <p>
                Add: &nbps; <span>{candidateForm.address.slice(0, 20)}</span>
              </p>
              <p>
                pos: &nbps; <span>{candidateForm.position}</span>
              </p>
            </div>
          </div>)
        }  
        {
          !fileUrl && (
            <div className={Style.sideInfo}>
              <div className={Style.sideInfo_box}>
                <h3>Create a new candidate</h3>
                <p> You vote with Blockchain</p>
                <p className={Style.sideInfo_para}>Contract Candidate list</p>
              </div>
            </div>
          )
        }
      </div>
      <div className={Style.voter}>
        <div className={Style.voter_container}>
          <h2>Add candidate</h2>
          <div className={Style.voter_container_box}>
            <div className={Style.voter_container_box_div}>
              <div {...getRootProps()}>
                <input {...getInputProps()}/>
              </div>
            </div>
          </div>
        </div>
        <div className={Style.input_container}>
          <Input inputType='text' title='Name' placeholder='voter Name' handleClick={(e) => setCandidateForm({...candidateForm, name: e.target.value })} />
          <Input inputType='text' title='Address' placeholder='voter address' handleClick={(e) => setCandidateForm({...candidateForm, address: e.target.value })} />
          <Input inputType='text' title='Position' placeholder='voter position' handleClick={(e) => setCandidateForm({...candidateForm, position: e.target.value })} />
          <div className={Style.Button}>
            <Button btnName='Add Candidate' handleClick={() => setCandidate( candidateForm, fileUrl, router )} />
          </div>
        </div>
      </div>
      {/* //////// */}
      <div className={Style.createdVoter}>
        <div className={Style.createdVoter_info}>
          <p>Notice for user</p>
          <p>Organizer <span>0x939939..</span></p>
          <p>Only Organizer can create a candidate.</p>
        </div>
      </div>
    </div>
  );

};

export default candidateRegistration;
import React, {useState, useEffect, useCallback, useContext} from 'react';
import { useRouter } from 'next/router';

import { VotingContext } from '../context/Voter';
import Style from '../styles/allowedVoters.module.css';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';
import { useDropzone } from 'react-dropzone';

const allowedVoters = () => { 
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({
    name: "",
    address: "",
    position:""
  });

  const router = useRouter();
  const {createVoter} = useContext(VotingContext);
  const {uploadToIPFS} = useContext(VotingContext);

  const onDrop = useCallback(async (acceptedfile) => {
    const url = await uploadToIPFS(acceptedfile[0]);
    setFileUrl(url);
  });

  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
  });

  // JSX 

  return ( 
    <div className={Style.createVoter}>
      <div>
        {fileUrl && (
          <div className={Style.voterInfo}>
            
            <div className={Style.voterInfo_paragraph}>
              <p>
                Name: <span>&nbps; {formInput.name}</span>
              </p>
              <p>
                Add: &nbps; <span>{formInput.address.slice(0, 20)}</span>
              </p>
              <p>
                pos: &nbps; <span>{formInput.position}</span>
              </p>
            </div>
          </div>)
        }  
        {
          !fileUrl && (
            <div className={Style.sideInfo}>
              <div className={Style.sideInfo_box}>
                <h2>Create a new voter</h2>
                <p>Vote with Blockchain</p>
                <p className={Style.sideInfo_para}>Contract Candidate list</p>
              </div>

            </div>
          )
        }
      </div>
      <div className={Style.voter}>
        <div className={Style.voter_container}>
          <h2>Add voter</h2>
          <div className={Style.voter_container_box}>
            <div className={Style.voter_container_box_div}>
              <div {...getRootProps()}>
                <input {...getInputProps()}/>
              </div>
            </div>
          </div>
        </div>
        <div className={Style.input_container}>
          <Input inputType='text' title='Name' placeholder='voter Name' handleClick={(e) => setFormInput({...formInput, name: e.target.value })} />
          <Input inputType='text' title='Address' placeholder='voter address' handleClick={(e) => setFormInput({...formInput, address: e.target.value })} />
          <Input inputType='text' title='Position' placeholder='voter position' handleClick={(e) => setFormInput({...formInput, position: e.target.value })} />
          <div className={Style.Button}>
            <Button btnName='Add Voter' handleClick={() => createVoter( formInput, router )} />
          </div>
        </div>
      </div>
      {/* //////// */}
      <div className={Style.createdVoter}>
        <div className={Style.createdVoter_info}>
          <p>Notice for user</p>
          <p>Organizer <span>0x939939..</span></p>
          <p>Only Owner can create a voter.</p>
        </div>
      </div>
    </div>
  );

};

export default allowedVoters;
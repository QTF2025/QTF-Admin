import React, { useState, useRef, useEffect } from 'react'
import './styles.scss'
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { postComment, postReview } from '../../store/actions/creators';
import { setError } from '../../store/reducers';
import RichTextEditor from 'react-rte';
import { toolbarConfigs } from './constants';

function CommentBox({ leadStatusId, leadId }:  any) {
  const [value, setValue] = useState(RichTextEditor.createEmptyValue());
  const inputRef: any = useRef(null);
  const dispatch = useDispatch()

  const onSubmitComment = async () => {
    try {
      if(value.toString('html') === '<p><br></p>'){
        dispatch(setError({ status: true, type: 'error', message: 'Please provide comment' }))
        return;
      }

      if(leadStatusId === '2'){
        await dispatch(postReview({ comment: value.toString('html') }, leadId))
              setValue(RichTextEditor.createEmptyValue())
      }else{
        await dispatch(postComment({ comment: value.toString('html') }, leadId))
              setValue(RichTextEditor.createEmptyValue())
      }
    } catch (err: any) {
      dispatch(setError({ status: true, type: 'error', message: err }))
    }
  }

  useEffect(() => {
    if(inputRef.current){
      inputRef.current.focus()
    }
  }, [])

  return (
    <div className='comment-box'>
       {/* <textarea
          rows={5}
          cols={10}
          value={value}
          ref={inputRef}
          onChange={(e) => setValue(e.target.value)}
          className="form-control"
        ></textarea> */}
        <RichTextEditor
          value={value}
          onChange={(e: any) => setValue(e)}
          toolbarConfig={toolbarConfigs}
        />
        <Button
          className="comment-box__button"
          type='primary'
          onClick={onSubmitComment}
        >
          Submit
        </Button>
    </div>
  )
}

export default CommentBox
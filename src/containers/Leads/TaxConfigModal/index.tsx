import { Button, Modal } from 'antd'
import React from 'react'
import TaxConfiguration from '../../TaxConfiguration'
import './styles.scss'

function TaxConfigModal({ show, selectedLead, hideModal }: any) {
  return (
    <Modal
        title={`${selectedLead ? selectedLead?.first_name + ' - ' : ''} Tax Config Data`}
        open={show}
        onCancel={hideModal}
        footer={() => <Button onClick={hideModal}>Close</Button>}
        className='tax-config-view'
      >
        {
            selectedLead ?  <TaxConfiguration leadData={selectedLead} section='TAX-CONFIG-VIEW' showHeader={false} /> : <p>No Data</p>
        }
        
    </Modal>
  )
}

export default TaxConfigModal
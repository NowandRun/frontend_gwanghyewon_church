import React from 'react';
import { Paper } from '@mui/material';
import Modal from '@mui/material/Modal';

interface CustomModalProps {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  closeModal,
  children,
}) => {
  return (
    <Modal open={isOpen} onClose={closeModal}>
      <Paper
        elevation={2}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '85%', // Initial width for larger screens
          maxWidth: '100%', // Ensure it doesn't exceed the screen width
          maxHeight: '90vh', // Limit height to 90% of viewport height
          overflowY: 'auto',
          border: 'transparent',
          // Responsive design using MUI breakpoints and Tailwind CSS
          '@media (max-width: 640px)': {
            width: '95%', // Adjust for smaller screens
          },
        }}
      >
        {children}
      </Paper>
    </Modal>
  );
};

export default CustomModal;

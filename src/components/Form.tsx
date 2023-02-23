import { FormEvent } from "react";
import { useForm } from "react-hook-form";

/*  Created by Stephen Kirby 02/22/23  
*   Registration form component using react-hook-form.
*   
*
*
*/      

    
export default function Form({
  errorMessage,
  onSubmit,
}: {
  errorMessage: string,
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
}) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    }
  });

  <form onSubmit={onSubmit}>

  </form>
}
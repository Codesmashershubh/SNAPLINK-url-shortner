import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Link as LinkIcon, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { resetPasswordRequest } from '@/services/auth.service';
import { apiErrorMessage } from '@/services/api';

const schema = z.object({
  password: z.string().min(8, 'At least 8 characters').regex(/\d/, 'Include at least one number'),
});
type FormValues = z.infer<typeof schema>;

export function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    if (!token) {
      toast.error('Reset link is missing a token');
      return;
    }
    setSubmitting(true);
    try {
      await resetPasswordRequest(token, values.password);
      toast.success('Password updated — please sign in');
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Could not reset password'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-grid bg-[#f0f0ee] px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2 text-lg font-semibold text-gray-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900 text-white">
            <LinkIcon className="h-3.5 w-3.5" />
          </span>
          SnapLink
        </Link>
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">Set a new password</h1>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="New password"
              type="password"
              placeholder="At least 8 characters"
              icon={<Lock className="h-4 w-4" />}
              error={errors.password?.message}
              {...register('password')}
            />
            <Button type="submit" className="w-full group" size="lg" loading={submitting}>
              Update password <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

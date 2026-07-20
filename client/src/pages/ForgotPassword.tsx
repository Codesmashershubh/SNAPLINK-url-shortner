import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Link as LinkIcon, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { forgotPasswordRequest } from '@/services/auth.service';
import { apiErrorMessage } from '@/services/api';

const schema = z.object({ email: z.string().email('Enter a valid email') });
type FormValues = z.infer<typeof schema>;

export function ForgotPassword() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      await forgotPasswordRequest(values.email);
      setSent(true);
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Something went wrong'));
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
          {sent ? (
            <div className="text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-blue-500" />
              <h1 className="mt-4 text-lg font-semibold text-gray-900">Check your inbox</h1>
              <p className="mt-2 text-sm text-gray-500">
                If that email is registered, a reset link is on its way.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-semibold text-gray-900">Reset your password</h1>
              <p className="mt-1 text-sm text-gray-500">
                We'll email you a link to set a new one.
              </p>
              <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@company.com"
                  icon={<Mail className="h-4 w-4" />}
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Button type="submit" className="w-full group" size="lg" loading={submitting}>
                  Send reset link <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </form>
            </>
          )}
        </div>
        <p className="mt-6 text-center text-sm text-gray-500">
          <Link to="/login" className="font-medium text-blue-500 hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

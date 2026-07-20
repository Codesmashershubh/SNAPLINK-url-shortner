import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { Link2, Lock, CalendarClock, Tag, Copy, Check } from 'lucide-react';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createLinkRequest } from '@/services/link.service';
import { apiErrorMessage } from '@/services/api';

const schema = z.object({
  originalUrl: z.string().url('Enter a valid URL, including https://'),
  customAlias: z.string().optional(),
  title: z.string().optional(),
  password: z.string().optional(),
  expiresAt: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export function CreateLinkModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [result, setResult] = useState<{ shortUrl: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const { shortUrl } = await createLinkRequest({
        originalUrl: values.originalUrl,
        customAlias: values.customAlias || undefined,
        title: values.title || undefined,
        password: values.password || undefined,
        expiresAt: values.expiresAt ? new Date(values.expiresAt).toISOString() : undefined,
      });
      setResult({ shortUrl });
      onCreated();
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Could not create link'));
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setResult(null);
    setCopied(false);
    reset();
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} title={result ? 'Link is live' : 'Create a short link'}>
      {result ? (
        <div className="space-y-5 text-center">
          <div className="mx-auto flex w-fit items-center justify-center rounded-xl border border-gray-200 bg-white p-4">
            <QRCodeSVG value={result.shortUrl} size={140} fgColor="#111827" />
          </div>
          <div className="flex items-center justify-between gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <span className="truncate font-mono text-sm text-gray-900">{result.shortUrl}</span>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(result.shortUrl).catch(() => {});
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="shrink-0 rounded-lg bg-gray-900 p-2 text-white"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
          <Button className="w-full" onClick={handleClose}>
            Done
          </Button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Destination URL"
            placeholder="https://example.com/your-long-link"
            icon={<Link2 className="h-4 w-4" />}
            error={errors.originalUrl?.message}
            {...register('originalUrl')}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Custom alias (optional)" placeholder="my-launch" icon={<Tag className="h-4 w-4" />} {...register('customAlias')} />
            <Input label="Title (optional)" placeholder="Spring launch" {...register('title')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Password (optional)"
              type="password"
              placeholder="Leave blank for none"
              icon={<Lock className="h-4 w-4" />}
              {...register('password')}
            />
            <Input
              label="Expires (optional)"
              type="date"
              icon={<CalendarClock className="h-4 w-4" />}
              {...register('expiresAt')}
            />
          </div>
          <Button type="submit" className="w-full" size="lg" loading={submitting}>
            Create link
          </Button>
        </form>
      )}
    </Dialog>
  );
}

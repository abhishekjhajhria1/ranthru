"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ReviewDialogProps {
    bookingId: string
    providerId: string
    providerName: string
    onReviewSubmitted: () => void
}

export function ReviewDialog({ bookingId, providerId, providerName, onReviewSubmitted }: ReviewDialogProps) {
    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId,
                    providerId,
                    rating,
                    comment
                })
            })

            if (res.ok) {
                toast({ title: "Review Submitted", description: "Thank you for your feedback." })
                setOpen(false)
                onReviewSubmitted()
            } else {
                throw new Error("Failed to submit")
            }
        } catch {
            toast({ variant: "destructive", title: "Error", description: "Could not submit review." })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs border-dashed">
                    Leave Review
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>Rate {providerName}</DialogTitle>
                    <DialogDescription>
                        Share your experience to help improving the community.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                type="button"
                                className={`transition-all hover:scale-110 ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-600'}`}
                            >
                                <Star className="w-8 h-8" />
                            </button>
                        ))}
                    </div>
                    <div className="grid gap-2">
                        <Textarea
                            id="comment"
                            placeholder="How was your experience?"
                            value={comment}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
                            className="bg-black/50 border-white/10"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-primary text-white">
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

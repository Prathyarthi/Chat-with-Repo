// // 'use client';

// // import { useState } from 'react';
// // import { askQuestion } from '@/lib/actions/ask.actions';
// // import { Textarea } from '@/components/ui/textarea';
// // import { Button } from '@/components/ui/button';
// // import { ScrollArea } from '@/components/ui/scroll-area';
// // import ReactMarkdown from 'react-markdown';

// // export default function ChatPage({ params }: { params: { repoId: string } }) {
// //     const [question, setQuestion] = useState('');
// //     const [streamResponse, setStreamResponse] = useState('');
// //     const [loading, setLoading] = useState(false);

// //     async function handleSubmit() {
// //         setLoading(true);
// //         setStreamResponse('');

// //         const output = await askQuestion(question, params.repoId);

// //         //@ts-ignore
// //         for await (const chunk of output) {
// //             setStreamResponse(prev => prev + chunk);
// //         }

// //         setLoading(false);
// //     }

// //     return (
// //         <div className="max-w-2xl mx-auto p-6 space-y-4">
// //             <h1 className="text-2xl font-bold">Ask a Question About This Repo</h1>

// //             <Textarea
// //                 value={question}
// //                 onChange={e => setQuestion(e.target.value)}
// //                 placeholder="Type your question about the repo..."
// //                 rows={4}
// //             />

// //             <Button onClick={handleSubmit} disabled={loading || !question.trim()}>
// //                 {loading ? 'Thinking...' : 'Ask AI'}
// //             </Button>

// //             <ScrollArea className="h-96 p-4 border rounded-md mt-4 bg-muted">
// //                 {streamResponse ? (
// //                     <div className="prose prose-invert">
// //                         <ReactMarkdown>
// //                             {streamResponse}
// //                         </ReactMarkdown>
// //                     </div>) : (
// //                     <p className="text-sm text-muted-foreground">AI response will appear here...</p>
// //                 )}
// //             </ScrollArea>
// //         </div>
// //     );
// // }


// 'use client';

// import { useState } from 'react';
// import { askQuestion } from '@/lib/actions/ask.actions';
// import { Textarea } from '@/components/ui/textarea';
// import { Button } from '@/components/ui/button';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import ReactMarkdown from 'react-markdown';

// export default function ChatPage() {
//     const [repoUrl, setRepoUrl] = useState('');
//     const [repoId, setRepoId] = useState('');
//     const [question, setQuestion] = useState('');
//     const [streamResponse, setStreamResponse] = useState('');
//     const [loading, setLoading] = useState(false);


//     function handleRepoUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
//         setRepoUrl(e.target.value);
//     }

//     async function handleSubmitRepoUrl() {
//         if (!repoUrl) {
//             alert('Please enter a valid repository URL');
//             return;
//         }
//         setLoading(true);
//         setStreamResponse('');

//         const extractedRepoId = extractRepoIdFromUrl(repoUrl);
//         setRepoId(extractedRepoId);
//     }

//     function extractRepoIdFromUrl(url: string) {
//         const match = url.match(/github.com\/([^\/]+\/[^\/]+)/);
//         return match ? match[1] : '';
//     }

//     async function handleSubmitQuestion() {
//         if (!repoId) {
//             alert('Please enter a valid repository URL');
//             return;
//         }

//         setLoading(true);
//         setStreamResponse('');

//         const textStream = await askQuestion(question, repoId);

//         //@ts-ignore
//         for await (const chunk of textStream) {
//             setStreamResponse(prev => prev + chunk);
//         }

//         setLoading(false);
//     }

//     return (
//         <div className="max-w-2xl mx-auto p-6 space-y-4">
//             <h1 className="text-2xl font-bold">Ask a Question About a Repo</h1>

//             <div>
//                 <label htmlFor="repoUrl" className="block text-sm font-semibold">Enter Repository URL</label>
//                 <input
//                     type="text"
//                     id="repoUrl"
//                     value={repoUrl}
//                     onChange={handleRepoUrlChange}
//                     placeholder="e.g. https://github.com/username/repo"
//                     className="w-full p-2 mt-2 border rounded-md"
//                 />
//                 <Button onClick={handleSubmitRepoUrl} disabled={!repoUrl.trim()}>
//                     Load Repo
//                 </Button>
//             </div>

//             {repoId && (
//                 <div className="mt-4">
//                     <h3 className="text-lg font-semibold">Repo ID: {repoId}</h3>
//                     <Textarea
//                         value={question}
//                         onChange={e => setQuestion(e.target.value)}
//                         placeholder="Type your question about the repo..."
//                         rows={4}
//                     />

//                     <Button onClick={handleSubmitQuestion} disabled={loading || !question.trim()}>
//                         {loading ? 'Thinking...' : 'Ask AI'}
//                     </Button>
//                 </div>
//             )}

//             <ScrollArea className="h-96 p-4 border rounded-md mt-4 bg-muted">
//                 {streamResponse ? (
//                     <div className="prose prose-invert">
//                         <ReactMarkdown>
//                             {streamResponse}
//                         </ReactMarkdown>
//                     </div>
//                 ) : (
//                     <p className="text-sm text-muted-foreground">AI response will appear here...</p>
//                 )}
//             </ScrollArea>
//         </div>
//     );
// }


'use client';

import { use, useState } from 'react';
import { askQuestion } from '@/lib/actions/ask.actions';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';

export default function ChatPage(props: { params: Promise<{ repoId: string }> }) {
    const [question, setQuestion] = useState('');
    const [streamResponse, setStreamResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const { repoId } = use(props.params);

    async function handleSubmit() {
        setLoading(true);
        setStreamResponse('');

        const textStream = await askQuestion(question, repoId);

        for await (const chunk of textStream) {
            setStreamResponse(prev => prev + chunk);
        }

        setLoading(false);
    }

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold">Ask a Question About This Repo</h1>

            <Textarea
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="Type your question about the repo..."
                rows={4}
            />

            <Button onClick={handleSubmit} disabled={loading || !question.trim()}>
                {loading ? 'Thinking...' : 'Ask AI'}
            </Button>

            <ScrollArea className="h-96 p-4 border rounded-md mt-4 bg-muted">
                {streamResponse ? (
                    <div className="prose prose-invert">
                        <ReactMarkdown>
                            {streamResponse}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">AI response will appear here...</p>
                )}
            </ScrollArea>
        </div>
    );
}
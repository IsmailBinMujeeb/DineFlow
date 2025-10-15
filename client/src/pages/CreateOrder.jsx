import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ButtonGroup } from "@/components/ui/button-group";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function CreateOrder() {

    const [menuItems, setMenuItems] = useState([]);
    const [selectedMenuItems, setSelectedMenuItems] = useState({});
    const [tableNumber, setTableNumber] = useState(0);
    // const [subTotal, setSubTotal] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {

        const headers = {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        };

        async function fetchData() {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}menu-item?limit=30`, { headers });

                if (response.ok || response.status === 404) {
                    const data = await response.json();
                    setMenuItems(data.data.docs);
                }
            } catch (error) {
                console.log(error)
            }
        }

        fetchData()
    }, [])

    async function handleSubmit() {
        const items = Object.keys(selectedMenuItems).map((itemId) => {
            const itemDetails = menuItems.find(v => v._id === itemId);
            return {
                item: itemId,
                quantity: selectedMenuItems[itemId],
                total: selectedMenuItems[itemId] * itemDetails.price
            };
        });

        const calculatedSubTotal = items.reduce((acc, cur) => acc + cur.total, 0);

        const response = await fetch(`${import.meta.env.VITE_API_URL}order/create`, {
            method: 'POST',
            body: JSON.stringify({
                items,
                tableNumber,
                tax: 0,
                subTotal: calculatedSubTotal,
                grandTotal: calculatedSubTotal
            }),
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            toast('Can\'t Create Order', {
                description: `Error while creating order: ${response.status}`,
            });
        } else {
            navigate('/dashboard');
        }
    }


    return (
        <div className="dark bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 text-zinc-50">
            <div className="w-full max-w-sm md:max-w-4xl">
                <div className="gap-3">
                    <Label htmlFor="tableNumber" className={'m-2'}>Table Number</Label>
                    <Input type="number" min={0} max={20} value={tableNumber} onChange={e => { if (!isNaN(Number(e.target.value))) setTableNumber(e.target.value); console.log(isNaN(Number(e.target.value))) }} id="tableNumber" placeholder="e.g. 1" />
                </div>
                <div className="p-2">
                    {menuItems &&
                        menuItems.map((item) => (
                            <div key={item._id} className="flex justify-between my-2">
                                <span>{item.itemName} <small>₹{item.price}</small></span>
                                {selectedMenuItems[item._id] ?
                                    <ButtonGroup>
                                        <Button size={'sm'} variant={'outline'} onClick={() => setSelectedMenuItems(prev => ({ ...prev, [item._id]: selectedMenuItems[item._id] - 1 }))}>-</Button>
                                        <Button size={'sm'} variant={'outline'}>{selectedMenuItems[item._id]}</Button>
                                        <Button size={'sm'} variant={'outline'} onClick={() => setSelectedMenuItems(prev => ({ ...prev, [item._id]: selectedMenuItems[item._id] + 1 }))}>+</Button>
                                    </ButtonGroup>
                                    :
                                    <Button onClick={() => setSelectedMenuItems(prev => ({ ...prev, [item._id]: 1 }))}>Add</Button>
                                }
                            </div>
                        ))}
                </div>
            </div>
            <Button onClick={handleSubmit} size={'lg'}>Create</Button>
        </div>
    )
}